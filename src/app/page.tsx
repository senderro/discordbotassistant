"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          🤖 Discord Donations Hub
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Empower your Discord community with seamless crypto donations.
          Built for speed, trust, and transparency.
        </p>

        <a
          href="https://discord.gg/seu-invite"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition"
        >
          🚀 Join our Discord
        </a>

        <div className="mt-10 text-sm text-gray-500">
          <p>Built with ❤️ at a Hackathon.</p>
        </div>
      </div>
    </main>
  );
}
