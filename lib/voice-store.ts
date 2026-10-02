// ---------------------------------------------------------------------------
// Voice store — every ElevenLabs clip is generated ONCE, then served from
// Vercel Blob (store « cadga-voix », public, linked to this project).
//
// Why: the voice routes used to ask ElevenLabs on every click, for every
// trainee, so the character quota emptied and the modules went silent
// (« Natural voice unavailable »). Now the first request for a sentence pays,
// every later request — any trainee, any deployment — reads the stored MP3.
//
// The clip key is a hash of everything that changes the audio (route, text,
// speed, voice, model…). Change any of it and a new clip is generated; the
// old one simply stops being used.
//
// Blob calls use the REST API directly (same requests as @vercel/blob v2,
// API version 12) so no new dependency is needed. If the store is missing or
// unreachable, the route falls back to generating the voice as before.
// ---------------------------------------------------------------------------

const API_URL = "https://vercel.com/api/blob";
const API_VERSION = "12";
const FOLDER = "voice";

function token(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

function storeId(rwToken: string): string {
  // Token format: vercel_blob_rw_<storeId>_<secret>
  return rwToken.split("_")[3] || "";
}

async function clipKey(parts: unknown[]): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(["v1", ...parts]));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

function audioResponse(body: ArrayBuffer, source: "store" | "generated") {
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "audio/mpeg", "Cache-Control": "public, max-age=604800, immutable", "X-Voice-Source": source },
  });
}

async function readStored(rwToken: string, pathname: string): Promise<ArrayBuffer | null> {
  try {
    const res = await fetch(`https://${storeId(rwToken)}.public.blob.vercel-storage.com/${pathname}`, { cache: "no-store", signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    return buf.byteLength > 0 ? buf : null;
  } catch {
    return null;
  }
}

async function store(rwToken: string, pathname: string, body: ArrayBuffer): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/?${new URLSearchParams({ pathname })}`, {
      method: "PUT",
      body,
      headers: {
        authorization: `Bearer ${rwToken}`,
        "x-api-version": API_VERSION,
        "x-vercel-blob-access": "public",
        "x-content-type": "audio/mpeg",
        "x-add-random-suffix": "0",
        "x-allow-overwrite": "1",
        "x-cache-control-max-age": "31536000",
        "x-content-length": String(body.byteLength),
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) console.error("Voice store: upload failed", res.status, (await res.text().catch(() => "")).slice(0, 200));
  } catch (error) {
    console.error("Voice store: upload error", error);
  }
}

/**
 * Returns the stored clip for `parts` if it exists; otherwise runs `generate`
 * (the route's ElevenLabs call), stores a successful MP3 and returns it.
 * Error responses from `generate` are passed through untouched.
 */
export async function storedVoice(parts: unknown[], generate: () => Promise<Response>): Promise<Response> {
  const rwToken = token();
  if (!rwToken) return generate();
  const pathname = `${FOLDER}/${await clipKey(parts)}.mp3`;
  const cached = await readStored(rwToken, pathname);
  if (cached) return audioResponse(cached, "store");
  const res = await generate();
  if (!res.ok || !(res.headers.get("content-type") || "").includes("audio")) return res;
  const body = await res.arrayBuffer();
  await store(rwToken, pathname, body);
  return audioResponse(body, "generated");
}
