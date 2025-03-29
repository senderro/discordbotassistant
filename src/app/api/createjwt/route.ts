import { createToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { creatorUser, to, amount } = body;

  if (!creatorUser || !to || !amount) {
    return NextResponse.json({ error: "Parâmetros ausentes" }, { status: 400 });
  }

  const token = createToken({ creatorUser, to, amount });

  return NextResponse.json({ token });
}
