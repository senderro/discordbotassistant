import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const discordId = searchParams.get("discordId");

    if (!discordId) {
      return NextResponse.json({ error: "Discord ID é obrigatório." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { discordId },
    });

    if (!user || !user.walletAddress) {
      return NextResponse.json({ error: "Usuário não encontrado ou sem carteira registrada." }, { status: 404 });
    }

    return NextResponse.json({ walletAddress: user.walletAddress });
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
