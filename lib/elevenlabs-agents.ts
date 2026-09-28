import {createHash} from "node:crypto";
import type {CallScenario} from "./call-scenarios";

// Un agent ElevenLabs par MES. Son nom contient une empreinte de la configuration : si la MES change,
// un nouvel agent est créé automatiquement ; sinon l'agent existant est réutilisé.
const API = "https://api.elevenlabs.io/v1/convai";
const cache = new Map<string, string>();

export class AgentError extends Error { constructor(public code: string, public status = 502) { super(code); } }

function config(s: CallScenario) {
  return {
    conversation_config: {
      agent: {first_message: "", language: "en", prompt: {prompt: s.prompt, temperature: 0.6}},
      tts: {voice_id: s.voiceId, model_id: "eleven_flash_v2", speed: 0.85},
      turn: {turn_timeout: 12},
      conversation: {max_duration_seconds: 480},
    },
    platform_settings: {
      evaluation: {criteria: s.criteria.map(c => ({id: c.id, name: c.name, type: "prompt", conversation_goal_prompt: c.goal}))},
    },
  };
}

async function call(path: string, key: string, init: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {...init, headers: {"xi-api-key": key, "Content-Type": "application/json", ...(init.headers || {})}, cache: "no-store", signal: AbortSignal.timeout(20000)});
  if (!res.ok) {
    let status = "";
    try { const b = await res.json(); status = typeof b?.detail?.status === "string" ? b.detail.status : ""; } catch {}
    console.error("CADGA/AD agents API", path.split("?")[0], res.status, status);
    throw new AgentError(status === "missing_permissions" || res.status === 401 ? "agents-permission" : res.status === 429 ? "rate-limited" : "agents-unavailable", res.status === 429 ? 429 : 502);
  }
  return res.json();
}

export async function agentFor(s: CallScenario, key: string): Promise<string> {
  const body = config(s);
  const hash = createHash("sha256").update(JSON.stringify(body)).digest("hex").slice(0, 10);
  const name = `AD LMS · MES ${s.n} · ${hash}`;
  const cached = cache.get(name);
  if (cached) return cached;
  const list = await call(`/agents?search=${encodeURIComponent(name)}&page_size=10`, key);
  const found = (Array.isArray(list?.agents) ? list.agents : []).find((a: {name?: string; agent_id?: string}) => a.name === name);
  let id: string | undefined = found?.agent_id;
  if (!id) {
    const created = await call(`/agents/create`, key, {method: "POST", body: JSON.stringify({name, ...body})});
    id = created?.agent_id;
  }
  if (!id) throw new AgentError("agents-unavailable");
  cache.set(name, id);
  return id;
}

export async function signedUrl(agentId: string, key: string): Promise<string> {
  const data = await call(`/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`, key);
  if (typeof data?.signed_url !== "string") throw new AgentError("agents-unavailable");
  return data.signed_url;
}

export async function conversation(id: string, key: string) {
  return call(`/conversations/${encodeURIComponent(id)}`, key);
}
