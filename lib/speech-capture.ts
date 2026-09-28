import type {SpeechRecognitionLike} from "./speech-recognition";

export type CaptureState = {phase:"permission"|"recording"|"transcribing"|"error";level:number;seconds:number;stop:()=>void;cancel:()=>void;error?:string;retry?:()=>void};
let active: RecorderRecognition | null = null;
let state: CaptureState | null = null;
const listeners = new Set<()=>void>();
export const getCaptureState = () => state;
export function subscribeCapture(listener:()=>void) { listeners.add(listener); return () => {listeners.delete(listener);}; }
export function cancelCapture() { active?.abort(); }
function publish(next:CaptureState|null) { state=next; listeners.forEach(listener=>listener()); }
export function recordingSupported() { return typeof window!=="undefined" && typeof navigator!=="undefined" && typeof navigator.mediaDevices?.getUserMedia==="function" && typeof window.MediaRecorder!=="undefined"; }

// Preserve the result shape and grading rules of the existing exercises.
export class RecorderRecognition implements SpeechRecognitionLike {
  constructor(private fallback?:()=>SpeechRecognitionLike|null) {}
  lang="en-GB"; interimResults=false; continuous=false; maxAlternatives=10;
  /** Inline mode: no dialog; the exercise follows the phases through onphase and the recording stops by itself after silence. */
  inline=false;
  onphase:null|((phase:CaptureState["phase"])=>void)=null;
  onstart:SpeechRecognitionLike["onstart"]=null;
  onresult:SpeechRecognitionLike["onresult"]=null;
  onerror:SpeechRecognitionLike["onerror"]=null;
  onend:SpeechRecognitionLike["onend"]=null;
  private finished=false;
  private started=false;
  private stream?:MediaStream;
  private recorder?:MediaRecorder;
  private context?:AudioContext;
  private timer?:ReturnType<typeof setInterval>;
  private watchdog?:ReturnType<typeof setTimeout>;
  private chunks:Blob[]=[];
  private bytes=0;
  private controller=new AbortController();
  start() {
    if(this.started)return;
    this.started=true; active?.abort(); active=this;
    if(!window.isSecureContext){this.fail("insecure");return;}
    this.update("permission");
    this.watchdog=setTimeout(()=>this.fail("permission-timeout"),30000);
    // Called directly from the tap; one stream is used through the whole recording.
    void this.capture();
  }
  private lastPhase?:CaptureState["phase"];
  private update(phase:CaptureState["phase"],level=0,seconds=0) {
    if(this.finished)return;
    if(phase!==this.lastPhase){this.lastPhase=phase;this.onphase?.(phase);}
    if(!this.inline)publish({phase,level,seconds,stop:()=>this.stop(),cancel:()=>this.abort()});
  }
  private async capture() {
    try {
      const stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
      if(this.finished){stream.getTracks().forEach(track=>track.stop());return;}
      clearTimeout(this.watchdog);this.stream=stream;
      const mimeType=["audio/webm;codecs=opus","audio/mp4","audio/webm","audio/ogg;codecs=opus"].find(type=>MediaRecorder.isTypeSupported(type));
      const recorder=new MediaRecorder(stream,{...(mimeType?{mimeType}:{}),audioBitsPerSecond:64000});
      this.recorder=recorder;
      recorder.ondataavailable=event=>{
        if(this.finished||!event.data.size)return;
        this.chunks.push(event.data);this.bytes+=event.data.size;
        if(this.bytes>2_000_000)this.fail("recording-too-large");
      };
      recorder.onerror=()=>this.fail("audio-capture");
      recorder.onstop=()=>{if(!this.finished)void this.transcribe(recorder.mimeType);};
      stream.getAudioTracks().forEach(track=>{track.onended=()=>{if(!this.finished&&recorder.state==="recording")this.fail("audio-capture");};});
      recorder.start(250);this.onstart?.();this.update("recording");
      const began=Date.now();
      let analyser:AnalyserNode|undefined;
      let samples:Float32Array<ArrayBuffer>|undefined;
      // Preserve pauses between spelled letters; finish after sound then 2s silence.
      let speechSamples=0;
      let lastSound=began;
      let noiseFloor=0.003;
      let peak=0;
      try {
        const context=new AudioContext();this.context=context;
        void context.resume().catch(()=>{});
        analyser=context.createAnalyser();analyser.fftSize=1024;
        context.createMediaStreamSource(stream).connect(analyser);
        samples=new Float32Array(analyser.fftSize);
      } catch { /* Some devices record successfully without a live meter. */ }
      this.timer=setInterval(()=>{
        if(this.finished||recorder.state!=="recording")return;
        let level=0;
        const now=Date.now();
        if(analyser&&samples&&this.context?.state==="running"){
          analyser.getFloatTimeDomainData(samples);
          const rms=Math.sqrt(samples.reduce((sum,v)=>sum+v*v,0)/samples.length);
          level=Math.min(1,rms*8);
          // Background noise must not keep the recording open: once speech has been heard,
          // only sound close to the speaking level counts as speech.
          const speaking=rms>Math.max(0.012,noiseFloor*3,peak*0.3);
          if(speaking){speechSamples++;lastSound=now;peak=Math.max(peak,rms);}
          else noiseFloor=rms<noiseFloor?noiseFloor*0.7+rms*0.3:noiseFloor*0.98+rms*0.02;
          if(speechSamples>=3&&now-lastSound>=2000){this.stop();return;}
        }
        const seconds=Math.floor((now-began)/1000);
        this.update("recording",level,seconds);
        if(seconds>=20)this.stop();
      },100);
    }catch(error){this.fail(error instanceof Error?error.name:"audio-capture");}
  }
  stop() {
    if(this.finished)return;
    if(this.recorder?.state==="recording"){
      this.recorder.stop();this.releaseMicrophone();this.update("transcribing");
    }else if(!this.recorder)this.abort();
  }
  abort() {
    if(this.finished)return;
    this.finished=true;this.controller.abort();
    if(this.recorder?.state==="recording")this.recorder.stop();
    this.cleanup();this.onerror?.({error:"aborted"});this.onend?.();
  }
  private async transcribe(mimeType:string) {
    this.releaseMicrophone();this.update("transcribing");
    const blob=new Blob(this.chunks,{type:mimeType||this.chunks[0]?.type||"audio/webm"});this.chunks=[];
    if(blob.size<100){this.fail("no-speech");return;}
    const extension=blob.type.includes("mp4")?"m4a":blob.type.includes("ogg")?"ogg":"webm";
    const form=new FormData();form.append("audio",blob,`recording.${extension}`);
    this.watchdog=setTimeout(()=>{this.controller.abort();this.offerFallback("network");},30000);
    try {
      const response=await fetch("/api/transcribe",{method:"POST",body:form,signal:this.controller.signal});
      const data=await response.json();
      if(this.finished)return;
      if(!response.ok){this.offerFallback(data.error||"network");return;}
      const transcript=typeof data.text==="string"?data.text.trim():"";
      if(!transcript){this.fail("no-speech");return;}
      this.finished=true;this.cleanup();
      this.onresult?.({resultIndex:0,results:[Object.assign([{transcript,confidence:1}],{isFinal:true})]});this.onend?.();
    }catch{if(!this.finished)this.offerFallback("network");}
  }
  private offerFallback(error:string) {
    if(this.finished)return;
    if(!this.fallback||this.inline){this.fail(error);return;}
    clearTimeout(this.watchdog);this.releaseMicrophone();this.chunks=[];
    publish({phase:"error",level:0,seconds:0,error,stop:()=>{},cancel:()=>this.abort(),retry:()=>{
      if(this.finished)return;
      this.finished=true;this.cleanup();
      const native=this.fallback?.();
      if(!native){this.onerror?.({error});this.onend?.();return;}
      native.onstart=()=>this.onstart?.();native.onresult=event=>this.onresult?.(event);
      native.onerror=event=>this.onerror?.(event);native.onend=()=>this.onend?.();
      native.start();
    }});
  }
  private fail(error:string) {
    if(this.finished)return;
    this.finished=true;this.controller.abort();
    if(this.recorder?.state==="recording")this.recorder.stop();
    this.cleanup();this.onerror?.({error});this.onend?.();
  }
  private releaseMicrophone() {
    clearInterval(this.timer);
    this.stream?.getTracks().forEach(track=>{track.onended=null;track.stop();});this.stream=undefined;
    if(this.context){void this.context.close().catch(()=>{});this.context=undefined;}
  }
  private cleanup(){clearTimeout(this.watchdog);this.releaseMicrophone();this.chunks=[];if(active===this){active=null;publish(null);}}
}
