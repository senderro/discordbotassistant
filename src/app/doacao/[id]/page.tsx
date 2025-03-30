"use client";

import { useState } from "react";

export default function PaginaDoacao() {
  const [valor, setValor] = useState("");

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-black">
        <h1 className="text-3xl font-bold text-center mb-6">💖 Donation Campaign</h1>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6 space-y-2">
          <p><strong>Discord User:</strong> @ExampleUser#1234</p>
          <p><strong>Progress:</strong> 0.42 / 1.00 ETH</p>
          <p><strong>Deadline:</strong> April 5, 2025</p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">🫂 Donors</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {/* Mock donation cards */}
          {[
            { name: "@Donator1", value: "0.10" },
            { name: "@Donator2", value: "0.05" },
            { name: "@Donator3", value: "0.05" },
            { name: "@Donator4", value: "0.05" },
          ].map((donor, index) => (
            <div key={index} className="bg-white p-3 rounded shadow text-center">
              <p className="font-bold">{donor.name}</p>
              <p className="text-green-600">{donor.value} ETH</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            ETH amount to donate:
          </label>
          <input
            type="number"
            min="0"
            step="0.001"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="0.05"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
          />
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
          >
            Donate Now
          </button>
        </div>
      </div>
    </main>
  );
}
