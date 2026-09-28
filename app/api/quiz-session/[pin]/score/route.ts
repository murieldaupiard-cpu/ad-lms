import { NextResponse } from "next/server";
import { updatePlayerResult } from "@/lib/quiz-sessions";

export async function POST(request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;
  const body = await request.json().catch(() => ({}));
  const session = await updatePlayerResult(pin, String(body.playerId ?? ""), Number(body.delta ?? 0), body.finished === true);
  if (!session) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(session);
}
