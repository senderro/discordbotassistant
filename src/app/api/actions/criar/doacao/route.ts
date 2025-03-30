import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  const { discordId, amount, expiresAt, threadId, channelId } = await req.json();

  if (!discordId || !amount) {
    return NextResponse.json({ error: "discordId ou valor ausente." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { discordId },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const action = await prisma.action.create({
    data: {
      type: "donation",
      creatorId: user.id,
      targetUserId: user.id,
      amount: new Decimal(amount),
      status: "pending",
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      discordThreadId: threadId,
      discordChannelId: channelId,
    },
  });

  return NextResponse.json({ id: action.id });
}
