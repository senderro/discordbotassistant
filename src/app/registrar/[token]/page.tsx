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
      setStatusMsg(`Erro: ${data.error || "Erro ao registrar usuário."}`);
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
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-black">
        🎟️ Registro de Usuário via Discord
      </h1>

      {!isConnected ? (
        <div className="mb-4">
          <p className="mb-2 text-black">Conecte sua carteira para continuar o registro:</p>
          <ConnectWallet />
        </div>
      ) : payload ? (
        <div className="space-y-4 border p-4 rounded-lg bg-white shadow text-black">
          <p>
            👤 <strong>Discord ID:</strong> {payload.discordId}
          </p>
          <p>
            🦊 <strong>Wallet (do Token):</strong> {payload.walletAddress}
          </p>
          <p>
            🔓 <strong>Wallet (conectada):</strong> {address}
          </p>

          {/* Esse botão futuramente vai usar o jwtToken no fetch */}
          <button
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={registrarUsuario}
          >
            Registrar Usuário
          </button>

          {statusMsg && (
            <p className="mt-2 text-sm text-black">{statusMsg}</p>
          )}
        </div>
      ) : (
        <p className="text-red-600">Token inválido ou ausente na URL.</p>
      )}
    </div>
  );
}
