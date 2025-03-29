"use client";

import { useParams } from "next/navigation";
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { useEffect, useState } from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { AddressByDiscordIdReturn, SendTokenPayloadCheck } from "@/lib/types";
import { useAutoSwitchNetworkHandler } from "@/lib/switchNetworkByCoin";
import { jwtDecode } from "jwt-decode";



export default function EnviarToken() {
  const { address, isConnected } = useAccount();
  console.log(address);
  const params = useParams();
  
  const [payload, setPayload] = useState<SendTokenPayloadCheck | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  console.log(statusMsg);

  const { data: hash, error, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const switchIfNecessary = useAutoSwitchNetworkHandler();
  
  useEffect(() => {
    if (payload?.coinType) {
      switchIfNecessary(payload.coinType);
    }
  }, [payload?.coinType]);


  useEffect(() => {
    const token = params?.token;

    if (typeof token !== 'string') return;

    // Decodifica o token para extrair o payload
    try {
      const decoded = jwtDecode<SendTokenPayloadCheck>(token);
      setPayload(decoded);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      setPayload(null);
    }

    // Verifica a validade do token chamando a API
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verifyJwt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setIsTokenValid(data.valid);
      } catch (error) {
        console.error('Erro ao verificar o token:', error);
        setIsTokenValid(false);
      }
    };

    verifyToken();
  }, [params]);


  useEffect(() => {
    const sendDiscordCallback = async () => {
      if (!payload?.threadId) return;
  
      try {
        const callbackRes = await fetch('/api/sendDiscordBotCallBack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            threadId: payload.threadId,
            message: `✅ Transação de ${payload.amount} ${payload.coinType} para ${payload.toDiscordId} concluída com sucesso.`,
          }),
        });
  
        if (!callbackRes.ok) {
          console.error("❌ Erro ao enviar callback para o bot.");
        }
      } catch (err) {
        console.error("❌ Erro de rede no callback:", err);
      }
    };
  
    if (isConfirmed) {
      sendDiscordCallback();
    }
  }, [isConfirmed, payload]);

  const handleSend = async () => {
    if (!payload?.toDiscordId || !payload?.amount) return;
  
    try {
      const res = await fetch(`/api/get/addressByDiscordId?discordId=${payload.toDiscordId}`, {
        method: "GET",
      });
  
      if (!res.ok) {
        throw new Error("Erro ao buscar o endereço do destinatário.");
      }
  
      const data: AddressByDiscordIdReturn = await res.json();
      
      const toWalletAddress = data.WalletAddress as `0x${string}`;
  
      sendTransaction({
        to: toWalletAddress,
        value: parseEther(payload.amount),
      });
    } catch (error) {
      console.error("Erro no envio:", error);
      setStatusMsg("❌ Falha ao obter endereço ou enviar transação.");
    }
  };

  
  
  if (isTokenValid === false) {
    return <p className="text-red-600">Token inválido ou expirado.</p>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6 text-black">💸 Enviar Token</h1>

      {!isConnected ? (
        <div className="mb-4">
          <p className="mb-2 text-black">Conecte sua carteira para continuar:</p>
          <ConnectWallet />
        </div>
      ) : payload ? (
        <div className="space-y-4 border p-4 rounded-lg bg-white shadow text-black">
          <p>👤 <strong>De:</strong> {payload.creatorUser}</p>
          <p>📤 <strong>Para:</strong> {payload.toDiscordId}</p>
          <p>💰 <strong>Quantidade:</strong> {payload.amount} {payload.coinType}</p>

          <button 
            onClick={handleSend}
            disabled={isPending}
            className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            {isPending ? "Enviando..." : "Enviar"}
          </button>

          {hash && (
            <div>
              <p>🔗 <strong>Tx Hash:</strong> {hash}</p>
              {isConfirming && <p>⌛ Aguardando confirmação...</p>}
              {isConfirmed && <p>✅ Transação confirmada!</p>}
            </div>
          )}

          {error && <p className="text-red-600">❌ Erro: {error.message}</p>}
        </div>
      ) : (
        <p className="text-red-600">Token inválido ou ausente na URL.</p>
      )}
    </div>
  );
}
