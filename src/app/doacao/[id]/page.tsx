"use client";

import { useState } from "react";

export default function PaginaDoacao() {
  const [valor, setValor] = useState("");

  return (
    <div className="max-w-2xl mx-auto p-6 text-black">
      <h1 className="text-3xl font-bold mb-6">💖 Campanha de Doação</h1>

      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-2">
        <p><strong>Usuário do Discord:</strong> @ExemploUser#1234</p>
        <p><strong>Progresso:</strong> 0.42 / 1.00 ETH</p>
        <p><strong>Data limite:</strong> 05/04/2025</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">🫂 Quem já doou:</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Mock dos quadrados de doadores */}
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="font-bold">@Donator1</p>
          <p className="text-green-600">0.1 ETH</p>
        </div>
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="font-bold">@Donator2</p>
          <p className="text-green-600">0.05 ETH</p>
        </div>
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="font-bold">@Donator3</p>
          <p className="text-green-600">0.05 ETH</p>
        </div>
        <div className="bg-white p-3 rounded shadow text-center">
          <p className="font-bold">@Donator4</p>
          <p className="text-green-600">0.05 ETH</p>
        </div>
        {/* Adicionar mais conforme necessário */}
      </div>

      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <label className="block text-sm font-medium">ETH value to donate:</label>
        <input
          type="number"
          min="0"
          step="0.001"
          className="w-full p-2 border rounded"
          placeholder="0.05"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
        />
        <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">
          Donate Now
        </button>
      </div>
    </div>
  );
}
