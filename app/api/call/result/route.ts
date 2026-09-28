import {NextResponse} from "next/server";
import {findScenario} from "@/lib/call-scenarios";
import {AgentError, agentFor, conversation} from "@/lib/elevenlabs-agents";
export const runtime = "nodejs";
export const maxDuration = 30;

// Résultat d'un appel terminé : transcription et évaluation de chaque critère par ElevenLabs.
const json = (body: object, status = 200) => NextResponse.json(body, {status, headers: {"Cache-Control": "no-store"}});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const scenario = findScenario(url.searchParams.get("mes") || "");
  const id = url.searchParams.get("id") || "";
  if (!scenario || !/^[A-Za-z0-9_-]{6,80}$/.test(id)) return json({error: "invalid-request"}, 400);
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) return json({error: "agents-not-configured"}, 503);
  try {
    const [agentId, data] = await Promise.all([agentFor(scenario, key), conversation(id, key)]);
    // Seules les conversations de l'agent de cette MES sont lisibles.
    if (data?.agent_id !== agentId) return json({error: "not-found"}, 404);
    const transcript = (Array.isArray(data.transcript) ? data.transcript : [])
      .filter((t: {message?: string}) => typeof t?.message === "string" && t.message.trim())
      .map((t: {role: string; message: string}) => ({role: t.role === "agent" ? "caller" : "learner", text: t.message.trim()}));
    const raw = data?.analysis?.evaluation_criteria_results || {};
    const criteria = scenario.criteria.map(c => ({id: c.id, name: c.name, result: raw[c.id]?.result || "unknown", rationale: typeof raw[c.id]?.rationale === "string" ? raw[c.id].rationale : ""}));
    const done = data?.status === "done" || data?.status === "failed";
    return json({status: done ? "done" : "processing", transcript, criteria, analysed: Object.keys(raw).length > 0});
  } catch (e) {
    const err = e instanceof AgentError ? e : new AgentError("agents-unavailable");
    return json({error: err.code}, err.status);
  }
}
