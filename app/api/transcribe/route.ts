import {NextResponse} from "next/server";
export const runtime="nodejs";
export const maxDuration=40;
const MAX_BYTES=2_000_000;
const acceptedTypes=new Set(["audio/webm","audio/mp4","audio/ogg","audio/wav","audio/x-wav","audio/mpeg"]);
// Best-effort per-instance burst protection. No audio or transcript is stored by CADGA.
const requests=new Map<string,{count:number;expires:number}>();
const json=(body:object,status=200)=>NextResponse.json(body,{status,headers:{"Cache-Control":"no-store"}});
export async function POST(request:Request){
  const origin=request.headers.get("origin");
  if(!origin||origin!==new URL(request.url).origin)return json({error:"invalid-origin"},403);
  const ip=request.headers.get("x-vercel-forwarded-for")||request.headers.get("x-forwarded-for")||"local";
  const now=Date.now();
  for(const[key,value]of requests)if(value.expires<now)requests.delete(key);
  const bucket=requests.get(ip)||{count:0,expires:now+60_000};
  if(++bucket.count>60)return json({error:"rate-limited"},429);
  if(requests.size>10000)return json({error:"rate-limited"},429);
  requests.set(ip,bucket);
  if(Number(request.headers.get("content-length"))>MAX_BYTES+10000)return json({error:"recording-too-large"},413);
  if(!request.headers.get("content-type")?.startsWith("multipart/form-data"))return json({error:"invalid-audio"},400);
  let form:FormData;
  try{form=await request.formData();}catch{return json({error:"invalid-audio"},400);}
  const audio=form.get("audio");
  if(!(audio instanceof File)||audio.size<100||!acceptedTypes.has(audio.type.split(";")[0]))return json({error:"invalid-audio"},400);
  if(audio.size>MAX_BYTES)return json({error:"recording-too-large"},413);
  const apiKey=process.env.ELEVENLABS_API_KEY;
  if(!apiKey)return json({error:"transcription-unavailable"},503);
  const upstream=new FormData();
  const extension=audio.type.includes("mp4")?"m4a":audio.type.includes("ogg")?"ogg":audio.type.includes("mpeg")?"mp3":audio.type.includes("wav")?"wav":"webm";
  upstream.append("file",audio,`recording.${extension}`);
  upstream.append("model_id","scribe_v2");upstream.append("language_code","eng");
  upstream.append("tag_audio_events","false");upstream.append("diarize","false");
  try{
    const response=await fetch("https://api.elevenlabs.io/v1/speech-to-text",{method:"POST",headers:{"xi-api-key":apiKey},body:upstream,signal:AbortSignal.timeout(25000)});
    if(!response.ok){
      let reason="unknown";
      try {const body=await response.json();const status=body?.detail?.status;if(typeof status==="string"&&/^[a-z_]{1,64}$/.test(status))reason=status;}catch{}
      // Only log the provider's machine-readable code, never audio, text or credentials.
      console.error("CADGA transcription provider status",response.status,reason);
      const error=reason==="missing_permissions"?"transcription-permission":reason==="quota_exceeded"?"transcription-quota":response.status===429?"rate-limited":"transcription-unavailable";
      return json({error},response.status===429?429:503);
    }
    const data=await response.json();
    const words=Array.isArray(data.words)?data.words.filter((word:{type?:string})=>word.type==="word"):null;
    const text=words?.length===0?"":typeof data.text==="string"?data.text.trim():"";
    return json({text});
  }catch{return json({error:"network"},504);}
}
