import assert from "node:assert/strict";
import test from "node:test";
import {readFileSync} from "node:fs";
import vm from "node:vm";
import ts from "typescript";
function setup({key=true,status=200,text="Five.",words=[{type:"word"}],reason}={}){
  const calls=[];
  const context={exports:{},require:()=>({NextResponse:{json:(body,options)=>Response.json(body,options)}}),process:{env:key?{ELEVENLABS_API_KEY:"test-only"}:{}},URL,File,FormData,AbortSignal,console:{error(){}},fetch:async(url,options)=>{calls.push({url,options});return {ok:status===200,status,json:async()=>({text,words,detail:{status:reason}})}}};
  vm.runInNewContext(ts.transpileModule(readFileSync(new URL("../app/api/transcribe/route.ts",import.meta.url),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,context);
  return {post:context.exports.POST,calls};
}
function request({origin="https://cadga.example",size=200,type="audio/webm"}={}){
  const body=new FormData();body.append("audio",new Blob([new Uint8Array(size)],{type}),"sample.webm");
  return new Request("https://cadga.example/api/transcribe",{method:"POST",headers:{origin},body});
}
test("rejects foreign origins and invalid or oversized audio before provider call",async()=>{
  const s=setup();for(const [options,status]of [[{origin:"https://other.example"},403],[{size:0},400],[{type:"text/plain"},400],[{size:2000001},413]])assert.equal((await s.post(request(options))).status,status);
  assert.equal(s.calls.length,0);
});
test("keeps credentials server-side and returns only an uncached transcript",async()=>{
  const s=setup();const r=await s.post(request());assert.equal(r.status,200);assert.deepEqual(await r.json(),{text:"Five."});assert.equal(r.headers.get("cache-control"),"no-store");
  assert.equal(s.calls[0].url,"https://api.elevenlabs.io/v1/speech-to-text");assert.equal(s.calls[0].options.body.get("model_id"),"scribe_v2");assert.equal(s.calls[0].options.body.get("language_code"),"eng");
});
test("missing configuration and provider failures return retryable errors",async()=>{
  for(const options of [{key:false},{status:401},{status:429}]){const s=setup(options);const r=await s.post(request());assert.equal(r.status,options.status===429?429:503);assert.ok((await r.json()).error);}
});
test("audio events alone are never graded as a spoken answer",async()=>{
  const s=setup({text:"[silence]",words:[{type:"audio_event"}]});assert.deepEqual(await (await s.post(request())).json(),{text:""});
});
test("rate limiting bounds repeated requests on one instance",async()=>{
  const s=setup();for(let i=0;i<60;i++)assert.equal((await s.post(request())).status,200);assert.equal((await s.post(request())).status,429);assert.equal(s.calls.length,60);
});

test("distinguishes provider permission and quota errors without exposing its message",async()=>{
 for(const [reason,error] of [["missing_permissions","transcription-permission"],["quota_exceeded","transcription-quota"]]){
  const s=setup({status:401,reason});assert.deepEqual(await (await s.post(request())).json(),{error});
 }
});
