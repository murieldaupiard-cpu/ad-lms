import { NextResponse } from "next/server";
import { matchPlayer } from "@/lib/quiz-sessions";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const result = await matchPlayer(String(body.name ?? ""), String(body.avatar ?? ""));
  if ("error" in result) return NextResponse.json(result, { status: 409 });
  return NextResponse.json(result);
}
