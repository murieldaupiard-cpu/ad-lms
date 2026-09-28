import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
function setup({audio=false,denied=false,deferPermission=false,mp4=false,response={text:"five"},status=200,deferResponse=false,fallback}={}){
  let resolvePermission,resolveResponse,recorder;let stopped=0;const sent=[];const timers=new Map();let clock=0,id=0;
  const stream={getTracks:()=>[track],getAudioTracks:()=>[track]},track={onended:null,stop(){stopped++;}};
  class Recorder{
    static isTypeSupported(type){return mp4?type==="audio/mp4":type==="audio/webm;codecs=opus";}
    constructor(s,options){assert.equal(s,stream);this.mimeType=options.mimeType;this.state="inactive";recorder=this;}
    start(){this.state="recording";}
    stop(){this.state="inactive";queueMicrotask(()=>{this.ondataavailable({data:new Blob([new Uint8Array(200)],{type:this.mimeType})});this.onstop();});}
  }
  const context={exports:{},window:{isSecureContext:true,MediaRecorder:Recorder},navigator:{mediaDevices:{getUserMedia:()=>denied?Promise.reject(new DOMException("Denied","NotAllowedError")):deferPermission?new Promise(resolve=>{resolvePermission=resolve}):Promise.resolve(stream)}},MediaRecorder:Recorder,Blob,FormData,AbortController,Error,DOMException,Date:{now:()=>clock},setTimeout:fn=>{timers.set(++id,fn);return id},clearTimeout:key=>timers.delete(key),setInterval:fn=>{timers.set(++id,fn);return id},clearInterval:key=>timers.delete(key),fetch:async(url,options)=>{sent.push({url,options});if(deferResponse)return new Promise(resolve=>{resolveResponse=resolve});return {ok:status===200,json:async()=>response}}};
  let amplitude=0;
  if(audio)context.AudioContext=class {state="running";resume(){return Promise.resolve()}close(){return Promise.resolve()}createMediaStreamSource(){return {connect(){}}}createAnalyser(){return {fftSize:1024,getFloatTimeDomainData(samples){samples.fill(amplitude)}}}};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../lib/speech-capture.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
  const api=context.exports,r=new api.RecorderRecognition(fallback),errors=[],results=[];let ends=0;
  r.onerror=e=>errors.push(e.error);r.onresult=e=>results.push(e.results[0][0].transcript);r.onend=()=>ends++;
  return {r,api,errors,results,sent,advance:(ms,level=0)=>{amplitude=level;for(let t=0;t<ms;t+=100){clock+=100;for(const fn of [...timers.values()])fn();}},get stopped(){return stopped},get ends(){return ends},resolvePermission:()=>resolvePermission(stream),resolveResponse:()=>resolveResponse({ok:true,json:async()=>response}),tick:()=>{clock=21000;for(const fn of [...timers.values()])fn();},get recorder(){return recorder}};
}
test("records, uploads compatible audio and delivers one transcript",async()=>{
  const s=setup();s.r.start();assert.equal(s.api.getCaptureState().phase,"permission");await flush();assert.equal(s.api.getCaptureState().phase,"recording");s.r.stop();await flush();
  assert.equal(s.sent[0].url,"/api/transcribe");assert.match(s.sent[0].options.body.get("audio").type,/webm/);assert.deepEqual(s.results,["five"]);assert.equal(s.stopped,1);assert.equal(s.ends,1);assert.equal(s.api.getCaptureState(),null);
});
test("uses MP4 on devices that do not support WebM",async()=>{
  const s=setup({mp4:true});s.r.start();await flush();s.r.stop();await flush();assert.equal(s.sent[0].options.body.get("audio").name,"recording.m4a");assert.equal(s.sent[0].options.body.get("audio").type,"audio/mp4");
});
test("denial and late permission after cancellation never upload",async()=>{
  const denied=setup({denied:true});denied.r.start();await flush();assert.deepEqual(denied.errors,["NotAllowedError"]);assert.equal(denied.sent.length,0);
  const late=setup({deferPermission:true});late.r.start();late.r.abort();late.resolvePermission();await flush();assert.equal(late.stopped,1);assert.equal(late.sent.length,0);assert.equal(late.ends,1);
});
test("cancelling active recording discards it and frees the microphone",async()=>{
  const s=setup();s.r.start();await flush();s.api.cancelCapture();await flush();assert.equal(s.stopped,1);assert.equal(s.sent.length,0);assert.deepEqual(s.errors,["aborted"]);
});
test("a late server result after cancellation cannot change the exercise",async()=>{
  const s=setup({deferResponse:true});s.r.start();await flush();s.r.stop();await flush();s.r.abort();s.resolveResponse();await flush();assert.deepEqual(s.results,[]);assert.equal(s.ends,1);assert.equal(s.sent[0].options.signal.aborted,true);
});
test("empty transcription and provider failure never count as answers",async()=>{
  for(const options of [{response:{text:""}},{response:{error:"transcription-unavailable"},status:503}]){
    const s=setup(options);s.r.start();await flush();s.r.stop();await flush();assert.equal(s.results.length,0);assert.equal(s.errors.length,1);assert.equal(s.ends,1);assert.equal(s.stopped,1);
  }
});
test("automatically stops at the duration limit",async()=>{
  const s=setup();s.r.start();await flush();s.tick();await flush();assert.equal(s.recorder.state,"inactive");assert.equal(s.stopped,1);assert.equal(s.sent.length,1);
});

test("provider outage offers a user-triggered native fallback without changing scores",async()=>{
  let starts=0;const native={start(){starts++;},onstart:null,onresult:null,onerror:null,onend:null};
  const s=setup({response:{error:"transcription-permission"},status:503,fallback:()=>native});
  s.r.start();await flush();s.r.stop();await flush();
  assert.equal(s.api.getCaptureState().phase,"error");assert.equal(starts,0);assert.equal(s.results.length,0);assert.equal(s.stopped,1);
  s.api.getCaptureState().retry();assert.equal(starts,1);assert.equal(s.api.getCaptureState(),null);
  native.onresult({results:[[{transcript:"five"}]]});native.onend();assert.deepEqual(s.results,["five"]);assert.equal(s.ends,1);
});

test("one tap records speech and validates automatically after silence",async()=>{
  const s=setup({audio:true});s.r.start();await flush();
  s.advance(500,0.06);s.advance(1900);assert.equal(s.sent.length,0);
  s.advance(100);await flush();assert.equal(s.sent.length,1);assert.deepEqual(s.results,["five"]);assert.equal(s.stopped,1);
});
test("initial silence and a brief noise do not submit prematurely",async()=>{
  const s=setup({audio:true});s.r.start();await flush();
  s.advance(3000);s.advance(100,0.06);s.advance(2500);
  assert.equal(s.recorder.state,"recording");assert.equal(s.sent.length,0);s.r.abort();
});
test("pauses between letters reset the end-of-answer timer",async()=>{
  const s=setup({audio:true});s.r.start();await flush();
  for(let i=0;i<4;i++){s.advance(300,0.06);s.advance(1500);assert.equal(s.sent.length,0);}
  s.advance(500);await flush();assert.equal(s.sent.length,1);
});
test("cancelling while waiting for silence never uploads audio",async()=>{
  const s=setup({audio:true});s.r.start();await flush();s.advance(500,0.06);s.r.abort();
  s.advance(3000);await flush();assert.equal(s.sent.length,0);assert.equal(s.ends,1);
});
test("inline spelling shows no dialog and still reports its phases",async()=>{
  const s=setup();const phases=[];s.r.inline=true;s.r.onphase=p=>phases.push(p);s.r.start();await flush();
  assert.equal(s.api.getCaptureState(),null);s.r.stop();await flush();
  assert.deepEqual(phases,["permission","recording","transcribing"]);assert.deepEqual(s.results,["five"]);
});
test("steady background noise does not keep the recording open after speech",async()=>{
  const s=setup({audio:true});s.r.start();await flush();
  s.advance(600,0.2);s.advance(2500,0.03);await flush();
  assert.equal(s.sent.length,1);
});
