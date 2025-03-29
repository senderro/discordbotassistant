import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ valid: false, error: 'Token não fornecido.' }, { status: 400 });
    }

    jwt.verify(token, JWT_SECRET!);
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false, error: 'Token inválido ou expirado.' }, { status: 401 });
  }
}
