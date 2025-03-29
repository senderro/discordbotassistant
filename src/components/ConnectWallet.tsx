"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useChains,
  useSwitchChain,
} from "wagmi";

export default function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending, status } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const chains = useChains();
  const { switchChain, error: switchError, isPending: switching } = useSwitchChain();

  const currentChain = chains.find((c) => c.id === chainId);

  return (
    <div className="p-6 border border-gray-200 rounded-xl bg-white shadow-lg max-w-md mx-auto space-y-6 text-gray-800">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        🦊 <span>MetaMask Login</span>
      </h2>

      {isConnected ? (
        <>
          <div className="space-y-1">
            <p>
              ✅ <strong>Endereço:</strong>{" "}
              <span className="text-green-600">{address}</span>
            </p>
            {currentChain ? (
              <>
                <p>
                  🌐 <strong>Rede atual:</strong>{" "}
                  <span className="text-black">{currentChain.name}</span>
                </p>
                <p>
                  🧬 <strong>Chain ID:</strong> {chainId}
                </p>
              </>
            ) : (
              <p className="text-red-500">⚠️ Rede não suportada.</p>
            )}
            <p className="text-sm text-gray-600">
              Redes suportadas: {chains.map((c) => c.name).join(", ")}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => switchChain({ chainId: chain.id })}
                disabled={switching || chain.id === chainId}
                className={`px-4 py-2 rounded transition font-medium ${
                  chain.id === chainId
                    ? "bg-gray-300 text-gray-700 cursor-default"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {switching && chain.id !== chainId
                  ? "Trocando..."
                  : `Trocar para ${chain.name}`}
              </button>
            ))}
          </div>

          {switchError && (
            <p className="text-red-600 text-sm mt-2">
              Erro ao trocar de rede: {switchError.message}
            </p>
          )}

          <button
            onClick={() => disconnect()}
            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-semibold"
          >
            Desconectar
          </button>
        </>
      ) : (
        <div className="space-y-3">
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition"
            >
              {isPending
                ? "Conectando..."
                : `Conectar com ${connector.name}`}
            </button>
          ))}

          {status === "error" && (
            <p className="text-red-600 text-sm">
              Erro ao conectar. Tente novamente.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
