import { NextResponse } from "next/server";
import { sendReaction } from "@/lib/quiz-sessions";

export async function POST(request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;
  const body = await request.json().catch(() => ({}));
  const session = await sendReaction(pin, String(body.playerId ?? ""), String(body.content ?? ""));
  if (!session) return NextResponse.json({ error: "invalid_reaction" }, { status: 400 });
  return NextResponse.json(session);
}
