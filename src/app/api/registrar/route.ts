import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken';
import { RegisterTokenPayloadCheck } from "@/lib/types";

const JWT_SECRET = process.env.JWT_SECRET;
const CALLBACK_URL = process.env.BOT_API_CALLBACK;


export async function POST(req: Request) {
    const { token, walletAddress, threadId, channelId } = await req.json();

  if (!token || !walletAddress) {
    return NextResponse.json(
      { error: "Token ou endereço da carteira ausente." },
      { status: 400 }
    );
  }
  jwt.verify(token, JWT_SECRET!);

  const decoded = jwt.decode(token);
  const payload = decoded as RegisterTokenPayloadCheck;

  if (!payload) {
    return NextResponse.json(
      { error: "Token inválido ou expirado." },
      { status: 400 }
    );
  }

  if (payload.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
    return NextResponse.json(
      { error: "Endereço da carteira não corresponde ao do token." },
      { status: 400 }
    );
  }

  // Criar ou atualizar o usuário
  const user = await prisma.user.upsert({
    where: { discordId: payload.discordId },
    update: { walletAddress },
    create: {
      discordId: payload.discordId,
      walletAddress,
    },
  });

  await prisma.action.create({
    data: {
      type: "register",
      creatorId: user.id,
      status: "completed",
      jwtToken: token,
      discordThreadId: threadId,
      discordChannelId: channelId,
    },
  });


  // Enviar callback para o bot (caso tenha thread)
  if (CALLBACK_URL && threadId) {
    try {
      
      await fetch(`${CALLBACK_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId,
          message: `✅ Wallet registered successfully for ${payload.discordId}`,
        }),
      });
    } catch (err) {
      console.error("❌ Erro ao chamar callback do bot:", err);
    }
  }

  return NextResponse.json({ message: "Usuário registrado com sucesso." });
}
