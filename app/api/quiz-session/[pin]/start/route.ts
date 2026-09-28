import { NextResponse } from "next/server";
import { markStarted } from "@/lib/quiz-sessions";

// The host calls this once the lobby countdown reaches zero, so joiners'
// devices know the game has actually begun (and can no longer join).
export async function POST(_request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;
  const session = await markStarted(pin);
  if (!session) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(session);
}
