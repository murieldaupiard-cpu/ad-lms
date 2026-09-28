import { NextResponse } from "next/server";
import { applyPlayerPower } from "@/lib/quiz-sessions";

export async function POST(request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;
  const body = await request.json().catch(() => ({}));
  const power = body.power === "shield" ? "shield" : body.power === "strike" ? "strike" : null;
  if (!power) return NextResponse.json({ error: "invalid_power" }, { status: 400 });
  const session = await applyPlayerPower(pin, String(body.playerId ?? ""), power);
  if (!session) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(session);
}
