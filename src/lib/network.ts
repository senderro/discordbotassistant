// lib/network.ts

export function getChainIdFromCoin(coinType?: string): number {
    switch (coinType?.toUpperCase()) {
      case "ETH":
        return 1; // Ethereum Mainnet
      case "ETHS":
        return 11155111; // Sepolia Testnet
      default:
        return 11155111; // Default para Sepolia
    }
  }
  