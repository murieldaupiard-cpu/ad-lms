import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import ts from "typescript";

function setup({supported=true,secure=true,throwStart=false}={}) {
  const natives=[];
  class Native {
    start() { this.started=true; if(throwStart) throw new DOMException("Denied","NotAllowedError"); }
    stop() { this.onend?.(); }
    abort() { this.aborted=true; this.onerror?.({error:"aborted"}); this.onend?.(); }
    constructor() { natives.push(this); }
  }
  let timer;
  const context={exports:{},require:()=>({recordingSupported:()=>false,cancelCapture:()=>{}}),window:{isSecureContext:secure,...(supported?{SpeechRecognition:Native}:{})},setTimeout:fn=>{timer=fn;return 1},clearTimeout:()=>{},Error,DOMException};
  const code=ts.transpileModule(readFileSync(new URL("../lib/speech-recognition.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(code,context);
  const api=context.exports;
  const recognition=api.prepareSpeechRecognition();
  const errors=[],results=[];let ends=0;
  if(recognition.recognition) {recognition.recognition.onerror=e=>errors.push(e.error);recognition.recognition.onresult=e=>results.push(e);recognition.recognition.onend=()=>ends++;}
  return {api,recognition:recognition.recognition,error:recognition.error,natives,errors,results,get ends(){return ends},timeout:()=>timer()};
}
test("prepares synchronously without requesting a separate microphone stream",()=>{
  const s=setup();assert.ok(s.recognition);s.recognition.start();assert.equal(s.natives[0].started,true);
});
test("unsupported browsers and insecure pages return actionable errors",()=>{
  assert.equal(setup({supported:false}).recognition,null);
  const s=setup({secure:false});assert.equal(s.recognition,null);assert.match(s.error,/HTTPS/);
});
test("permission exceptions are reported and end the attempt once",()=>{
  const s=setup({throwStart:true});s.recognition.start();assert.deepEqual(s.errors,["NotAllowedError"]);assert.equal(s.ends,1);
});
test("empty end and timeout do not leave an exercise listening indefinitely",()=>{
  const s=setup();s.recognition.start();s.natives[0].onend();assert.deepEqual(s.errors,["no-speech"]);assert.equal(s.ends,1);
  const timed=setup();timed.recognition.start();timed.timeout();assert.deepEqual(timed.errors,["no-speech"]);assert.equal(timed.ends,1);assert.equal(timed.natives[0].aborted,true);
});
test("a successful result is delivered once and ignores late events",()=>{
  const s=setup();s.recognition.start();const result={results:[[{transcript:"five"}]]};
  s.natives[0].onresult(result);s.natives[0].onresult(result);s.natives[0].onend();
  assert.equal(s.results.length,1);assert.equal(s.ends,1);assert.equal(s.errors.length,0);
});
test("starting another exercise cancels the previous session",()=>{
  const s=setup();s.recognition.start();const other=s.api.createSpeechRecognition();other.start();
  assert.equal(s.natives[0].aborted,true);assert.deepEqual(s.errors,["aborted"]);
  s.api.cancelSpeechRecognition();assert.equal(s.natives[1].aborted,true);
});
function setupWithRecorder() {
  const natives=[],recorders=[];
  class Native { start(){this.started=true} stop(){} abort(){this.aborted=true} constructor(){natives.push(this)} }
  class Recorder { constructor(){recorders.push(this)} start(){this.started=true;this.onstart?.()} stop(){} abort(){} }
  const context={exports:{},require:()=>({recordingSupported:()=>true,cancelCapture:()=>{},RecorderRecognition:Recorder}),window:{isSecureContext:true,SpeechRecognition:Native},setTimeout:()=>1,clearTimeout:()=>{},Error,DOMException};
  const code=ts.transpileModule(readFileSync(new URL("../lib/speech-recognition.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
  vm.runInNewContext(code,context);
  return {api:context.exports,natives,recorders};
}
test("browser recognition is used first, without the recording dialog",()=>{
  const s=setupWithRecorder();const r=s.api.createSpeechRecognition();r.start();
  assert.equal(s.natives.length,1);assert.equal(s.natives[0].started,true);assert.equal(s.recorders.length,0);
});
test("a blocked browser service hands over to the recorded transcription",()=>{
  const s=setupWithRecorder();const r=s.api.createSpeechRecognition();const errors=[];let started=0;
  r.onerror=e=>errors.push(e.error);r.onstart=()=>started++;r.start();s.natives[0].onerror({error:"network"});
  assert.equal(s.recorders.length,1);assert.equal(s.recorders[0].started,true);assert.equal(started,1);assert.deepEqual(errors,[]);
});
