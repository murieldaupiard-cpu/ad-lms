import {NextResponse} from "next/server";
import {findScenario} from "@/lib/call-scenarios";
import {AgentError, agentFor, signedUrl} from "@/lib/elevenlabs-agents";
export const runtime = "nodejs";
export const maxDuration = 30;

// Démarre un appel : renvoie une URL signée, à usage unique, vers l'agent ElevenLabs qui joue l'appelant.
const requests = new Map<string, {count: number; expires: number}>();
const json = (body: object, status = 200) => NextResponse.json(body, {status, headers: {"Cache-Control": "no-store"}});

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return json({error: "invalid-origin"}, 403);
  const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "local";
  const now = Date.now();
  for (const [k, v] of requests) if (v.expires < now) requests.delete(k);
  const bucket = requests.get(ip) || {count: 0, expires: now + 10 * 60_000};
  if (++bucket.count > 12) return json({error: "rate-limited"}, 429);
  requests.set(ip, bucket);
  let body: {mes?: string};
  try { body = await request.json(); } catch { return json({error: "invalid-request"}, 400); }
  const scenario = findScenario(String(body.mes || ""));
  if (!scenario) return json({error: "unknown-mes"}, 404);
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return json({error: "agents-not-configured"}, 503);
  try {
    const agentId = await agentFor(scenario, key);
    return json({signedUrl: await signedUrl(agentId, key)});
  } catch (e) {
    const err = e instanceof AgentError ? e : new AgentError("agents-unavailable");
    return json({error: err.code}, err.status);
  }
}
