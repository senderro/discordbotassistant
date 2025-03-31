import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { donationId, donorAddress, amount, txHash } = await req.json();

    if (!donationId || !donorAddress || !amount || !txHash) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Buscar o usuário que fez a doação pela wallet
    const user = await prisma.user.findFirst({
      where: {
        walletAddress: {
          equals: donorAddress,
          mode: "insensitive",
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Donor not found. Make sure the wallet is registered." },
        { status: 404 }
      );
    }

    // Criar DonationEntry
    const entry = await prisma.donationEntry.create({
      data: {
        donationId,
        donorId: user.id,
        amount: new Decimal(amount),
        txHash,
      },
    });

    return NextResponse.json({ success: true, id: entry.id });
  } catch (err) {
    console.error("❌ Error creating donation entry:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
