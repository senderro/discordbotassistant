"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          🤖 MetamaskSDK Discord Assistant Hub
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Empower your Discord community with seamless crypto functions.
          Built for speed, trust, and transparency.
        </p>

        <a
          href="https://discord.com/oauth2/authorize?client_id=1354634234526171306&permissions=8&integration_type=0&scope=bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow transition"
        >
          🚀 Use Bot
        </a>

        <div className="mt-10 text-sm text-gray-500">
          <p>Built with ❤️ at a Hackathon.</p>
        </div>
      </div>
    </main>
  );
}
