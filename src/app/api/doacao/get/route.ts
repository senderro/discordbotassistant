import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const actionId = searchParams.get("id");

    if (!actionId) {
      return NextResponse.json({ error: "Missing donation ID." }, { status: 400 });
    }

    const action = await prisma.action.findUnique({
      where: { id: actionId },
      include: {
        targetUser: true,
        donationEntries: {
          include: {
            donor: true,
          },
        },
      },
    });

    if (!action || action.type !== "donation") {
      return NextResponse.json({ error: "Donation action not found." }, { status: 404 });
    }

    const amountCollected = action.donationEntries.reduce((total, entry) => {
      return total + parseFloat(entry.amount.toString());
    }, 0);

    const donors = action.donationEntries.map((entry) => ({
      discordId: entry.donor.discordId,
      amount: parseFloat(entry.amount.toString()),
    }));

    return NextResponse.json({
      targetDiscordId: action.targetUser?.discordId,
      targetWalletAddress: action.targetUser?.walletAddress,
      amountGoal: parseFloat(action.amount?.toString() || "0"),
      amountCollected,
      donors,
      expiresAt: action.expiresAt,
      token: action.token,
      discordThreadId: action.discordThreadId,
    });
  } catch (error) {
    console.error("❌ Error fetching donation action:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
