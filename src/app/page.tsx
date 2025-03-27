"use client";

import { useState } from "react";

type TokenPayload = {
  from: string;
  to: string;
  amount: string;
  iat?: number;
  exp?: number;
};

export default function Home() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const [generatedToken, setGeneratedToken] = useState("");
  const [validateInput, setValidateInput] = useState("");
  const [validatedData, setValidatedData] = useState<TokenPayload | null>(null);
  const [validationError, setValidationError] = useState("");

  const handleGenerate = async () => {
    const res = await fetch("/api/createjwt", {
      method: "POST",
      body: JSON.stringify({ from, to, amount }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setGeneratedToken(data.token);
  };

  const handleValidate = async () => {
    try {
      const res = await fetch("/api/verifyjwt", {
        method: "POST",
        body: JSON.stringify({ token: validateInput }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();

      if (!res.ok) {
        setValidationError(result.error || "Erro desconhecido");
        setValidatedData(null);
      } else {
        setValidatedData(result.data as TokenPayload);
        setValidationError("");
      }
    } catch {
      setValidationError("Erro ao validar o token");
      setValidatedData(null);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔐 Criar JWT</h1>
      <input
        placeholder="from (0x...)"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        placeholder="to (0x...)"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <input
        placeholder="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Gerar Token
      </button>

      {generatedToken && (
        <div className="break-words mb-8">
          <strong>Token Gerado:</strong>
          <p className="bg-gray-100 p-2">{generatedToken}</p>
        </div>
      )}

      <h2 className="text-xl font-bold mb-2">✅ Validar JWT</h2>
      <textarea
        rows={3}
        placeholder="Cole o token aqui"
        value={validateInput}
        onChange={(e) => setValidateInput(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={handleValidate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Validar Token
      </button>

      {validationError && (
        <p className="text-red-600 mt-2">{validationError}</p>
      )}

      {validatedData && (
        <div className="bg-gray-100 p-4 mt-4">
          <h3 className="font-semibold">Dados do Token:</h3>
          <pre>{JSON.stringify(validatedData, null, 2)}</pre>
        </div>
      )}
    </main>
  );
}
