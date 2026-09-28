import { NextResponse } from "next/server";
import { joinSession } from "@/lib/quiz-sessions";

// A learner joins a live session by scanning the QR code (or typing the PIN)
// and picking a name + avatar on /day2/quiz/join.
export async function POST(request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;

  let body: { name?: string; avatar?: string } = {};
  try {
    body = await request.json();
  } catch {
    // ignore — treated as an empty body below
  }

  const result = await joinSession(pin, body.name ?? "", body.avatar ?? "🙂");
  if ("error" in result) {
    const status = result.error === "not_found" ? 404 : 409;
    return NextResponse.json({ error: result.error }, { status });
  }
  return NextResponse.json(result);
}
