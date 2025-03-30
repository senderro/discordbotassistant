"use client";

import { useParams } from "next/navigation";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { RegisterTokenPayloadCheck } from "@/lib/types";
import { useAutoSwitchNetworkHandler } from "@/lib/switchNetworkByCoin";

export default function RegistrarToken() {
  const { address, isConnected } = useAccount();
  const params = useParams();

  const [payload, setPayload] = useState<RegisterTokenPayloadCheck | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const switchIfNecessary = useAutoSwitchNetworkHandler();

  useEffect(() => {
    if (payload?.coinType) {
      switchIfNecessary(payload.coinType);
    }
  }, [payload?.coinType]);

  const registrarUsuario = async () => {
    if (!isConnected || !address || !jwtToken || !payload) return;

    setStatusMsg("Registrando...");

    const res = await fetch("/api/registrar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: jwtToken,
        walletAddress: address,
        threadId: payload.threadId,
        channelId: payload.channelId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatusMsg(`❌ ${data.error || "Erro ao registrar usuário."}`);
    } else {
      setStatusMsg("✅ Registro realizado com sucesso!");
    }
  };

  useEffect(() => {
    const token = params?.token;
    if (typeof token !== "string") return;

    try {
      const decoded = jwt.decode(token);

      if (
        typeof decoded === "object" &&
        decoded !== null &&
        "discordId" in decoded &&
        "walletAddress" in decoded
      ) {
        setPayload(decoded as RegisterTokenPayloadCheck);
        setJwtToken(token);
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
    }
  }, [params]);

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Register
        </h1>

        {!isConnected ? (
          <div className="text-center">
            <p className="mb-4 text-gray-700">Conecte sua carteira para continuar:</p>
            <ConnectWallet />
          </div>
        ) : payload ? (
          <div className="space-y-4 text-gray-800">
            <p>
              👤 <strong>Discord ID:</strong> {payload.discordId}
            </p>
            <p>
              🦊 <strong>Wallet to Register:</strong> {payload.walletAddress}
            </p>
            <p>
              🔓 <strong>Connected Wallet:</strong> {address}
            </p>

            <button
              onClick={registrarUsuario}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Register User
            </button>

            {statusMsg && (
              <p className="mt-2 text-center text-sm font-medium">
                {statusMsg}
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-red-600 font-medium">
            Token inválido ou ausente na URL.
          </p>
        )}
      </div>
    </main>
  );
}
