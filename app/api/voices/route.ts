import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "missing key" }, { status: 500 });

  const response = await fetch("https://api.elevenlabs.io/v1/voices", {
    headers: { "xi-api-key": apiKey },
    cache: "no-store",
  });

  const text = await response.text();
  if (!response.ok) return NextResponse.json({ error: text }, { status: response.status });
  const data = JSON.parse(text);
  const voices = Array.isArray(data.voices) ? data.voices.map((v: any) => ({
    voice_id: v.voice_id,
    name: v.name,
    category: v.category,
    labels: v.labels,
  })) : [];
  return NextResponse.json({ voices });
}
