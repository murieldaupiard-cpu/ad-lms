import { NextResponse } from "next/server";
import { getSession } from "@/lib/quiz-sessions";

// Polled by the host's lobby screen to see who has joined so far.
export async function GET(_request: Request, { params }: { params: Promise<{ pin: string }> }) {
  const { pin } = await params;
  const session = await getSession(pin);
  if (!session) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  return NextResponse.json(session);
}
