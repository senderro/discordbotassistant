"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Donor {
  discordId: string;
  amount: number;
}

interface DonationData {
  targetDiscordId: string;
  amountGoal: number;
  amountCollected: number;
  donors: Donor[];
  expiresAt: string;
  token: string;
}

export default function PaginaDoacao() {
  const { id } = useParams();
  const [valor, setValor] = useState("");
  const [donation, setDonation] = useState<DonationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const fetchDonation = async () => {
      try {
        const res = await fetch(`/api/doacao?id=${encodeURIComponent(id)}`);
        const data = await res.json();
        setDonation(data);
      } catch (err) {
        console.error("❌ Failed to fetch donation data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-black">
        <p>Loading donation data...</p>
      </main>
    );
  }

  if (!donation) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 text-red-600">
        <p>Donation not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl text-black">
        <h1 className="text-3xl font-bold text-center mb-6">💖 Donation Campaign</h1>

        <div className="bg-gray-50 p-4 rounded-lg shadow-inner mb-6 space-y-2">
          <p><strong>Discord User:</strong> @{donation.targetDiscordId}</p>
          <p>
            <strong>Progress:</strong>{" "}
            {donation.amountCollected.toFixed(3)} / {donation.amountGoal.toFixed(3)} {donation.token}
          </p>
          <p>
            <strong>Deadline:</strong>{" "}
            {new Date(donation.expiresAt).toLocaleDateString()}
          </p>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-center">🫂 Donors</h2>
        {donation.donors.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            {donation.donors.map((donor, index) => (
              <div key={index} className="bg-white p-3 rounded shadow text-center">
                <p className="font-bold">@{donor.discordId}</p>
                <p className="text-green-600">{donor.amount.toFixed(3)} {donation.token}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-8">No donations yet.</p>
        )}

        <div className="bg-gray-50 p-6 rounded-lg shadow-inner space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            {donation.token} amount to donate:
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
