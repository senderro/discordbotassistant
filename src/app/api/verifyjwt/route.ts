import { verifyToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json({ error: "Token ausente" }, { status: 400 });
  }

  const verified = verifyToken(token);

  if (!verified) {
    return NextResponse.json({ error: "Token inválido ou expirado" }, { status: 401 });
  }

  return NextResponse.json({ data: verified });
}
