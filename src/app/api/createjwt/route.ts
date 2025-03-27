import { createToken } from "@/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { from, to, amount } = body;

  if (!from || !to || !amount) {
    return NextResponse.json({ error: "Parâmetros ausentes" }, { status: 400 });
  }

  const token = createToken({ from, to, amount });

  return NextResponse.json({ token });
}
