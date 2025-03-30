"use client";

import { useParams } from "next/navigation";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import {
  AddressByDiscordIdReturn,
  SendTokenPayloadCheck,
} from "@/lib/types";
import { useAutoSwitchNetworkHandler } from "@/lib/switchNetworkByCoin";
import { jwtDecode } from "jwt-decode";

export default function EnviarToken() {
  const { address, isConnected } = useAccount();
  console.log(address);
  const params = useParams();

  const [payload, setPayload] = useState<SendTokenPayloadCheck | null>(null);
  const [toWalletAddress, setToWalletAddress] = useState<`0x${string}` | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const switchIfNecessary = useAutoSwitchNetworkHandler();

  useEffect(() => {
    if (payload?.coinType) {
      switchIfNecessary(payload.coinType);
    }
  }, [payload?.coinType]);

  useEffect(() => {
    const token = params?.token;

    if (typeof token !== "string") return;

    const processToken = async () => {
      try {
        const decoded = jwtDecode<SendTokenPayloadCheck>(token);
        setPayload(decoded);

        const verifyRes = await fetch("/api/verifyJwt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const verifyData = await verifyRes.json();
        setIsTokenValid(verifyData.valid);

        if (verifyData.valid && decoded.toDiscordId) {
          const addressRes = await fetch(
            `/api/get/addressByDiscordId?discordId=${encodeURIComponent(
              decoded.toDiscordId
            )}`
          );

          if (addressRes.ok) {
            const addressData: AddressByDiscordIdReturn = await addressRes.json();
            setToWalletAddress(addressData.WalletAddress as `0x${string}`);
          } else {
            console.error("❌ Failed to fetch recipient address.");
          }
        }
      } catch (err) {
        console.error("❌ Error processing token:", err);
        setPayload(null);
        setIsTokenValid(false);
      }
    };

    processToken();
  }, [params]);

  useEffect(() => {
    const sendDiscordCallback = async () => {
      if (!payload?.threadId) return;

      try {
        const callbackRes = await fetch("/api/sendDiscordBotCallBack", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            threadId: payload.threadId,
            message: `✅ Transaction of ${payload.amount} ${payload.coinType} to ${payload.toDiscordId} completed.`,
          }),
        });

        if (!callbackRes.ok) {
          console.error("❌ Error sending callback to bot.");
        }
      } catch (err) {
        console.error("❌ Network error in callback:", err);
      }
    };

    if (isConfirmed) {
      sendDiscordCallback();
    }
  }, [isConfirmed, payload]);

  const handleSend = async () => {
    if (!toWalletAddress || !payload?.amount) return;

    try {
      sendTransaction({
        to: toWalletAddress,
        value: parseEther(payload.amount),
      });
    } catch (error) {
      console.error("Send error:", error);
      setStatusMsg("❌ Failed to fetch address or send transaction.");
    }
  };

  if (isTokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600 text-lg font-semibold">
        Invalid or expired token.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg text-black">
        <h1 className="text-3xl font-bold text-center mb-6">💸 Send Token</h1>

        {!isConnected ? (
          <div className="text-center">
            <p className="mb-4 text-gray-700">Reconnect your wallet to continue:</p>
            <ConnectWallet />
          </div>
        ) : payload ? (
          <div className="space-y-4">
            <p>
              👤 <strong>From:</strong> {payload.creatorUser}
            </p>
            <p>
              📤 <strong>To:</strong> {payload.toDiscordId}
            </p>
            <p>
              💰 <strong>Amount:</strong> {payload.amount} {payload.coinType}
            </p>

            <button
              onClick={handleSend}
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              {isPending ? "Sending..." : "Send"}
            </button>

            {hash && (
              <div className="text-sm space-y-1">
                <p>🔗 <strong>Tx Hash:</strong> {hash}</p>
                {isConfirming && <p>⌛ Waiting for confirmation...</p>}
                {isConfirmed && <p className="text-green-600">✅ Transaction confirmed!</p>}
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm">❌ Error: {error.message}</p>
            )}

            {statusMsg && (
              <p className="text-sm font-medium">{statusMsg}</p>
            )}
          </div>
        ) : (
          <p className="text-center text-red-600 font-medium">
            Invalid or missing token from URL.
          </p>
        )}
      </div>
    </main>
  );
}
