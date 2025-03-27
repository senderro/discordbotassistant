"use client";

import { useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import ConnectWallet from "@/components/ConnectWallet";
import { verifyJwtRegister } from "@/lib/jwt";
import { useEffect, useState } from "react";

interface JwtPayload {
  discordId: string;
  walletAddress: string;
}

export default function RegistrarToken() {
  const { address, isConnected } = useAccount();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [payload, setPayload] = useState<JwtPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    try {
      const decoded = verifyJwtRegister(token);
      setPayload(decoded as JwtPayload);
    } catch {
      setError("Token inválido ou expirado.");
    }
  }, [token]);

  const isMatching = payload && address?.toLowerCase() === payload.walletAddress.toLowerCase();
  console.log(isMatching);

  return (
    <div className="p-6">
      <h1>Registrar Carteira</h1>

      {!isConnected ? (
        <ConnectWallet />
      ) : 
        <p className="text-red-500">{error}</p>
     }
    </div>
  );
}
