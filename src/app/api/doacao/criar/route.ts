import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  const body = await req.json();
  const { discordId, amount, token, expiresAt, discordThreadId, discordChannelId } = body;

  // Validação básica
  if (!discordId || !amount || !token) {
    return NextResponse.json(
      { error: "Missing required fields: discordId, amount or token." },
      { status: 400 }
    );
  }

  // Buscar o usuário pelo Discord ID
  const user = await prisma.user.findUnique({
    where: { discordId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not registered with this Discord ID." },
      { status: 404 }
    );
  }

  try {
    const action = await prisma.action.create({
      data: {
        type: "donation",
        creatorId: user.id,
        targetUserId: user.id,
        amount: new Decimal(amount),
        token,
        status: "pending",
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        discordThreadId,
        discordChannelId,
      },
    });

    return NextResponse.json({ id: action.id });
  } catch (error) {
    console.error("❌ Failed to create donation action:", error);
    return NextResponse.json(
      { error: "Internal server error while creating donation action." },
      { status: 500 }
    );
  }
}
