"use client";

import { useMemo } from "react";
import { injected } from "wagmi/connectors";
import { MetaMaskSDK } from "@metamask/sdk";
import { EIP1193Provider } from "viem";

export function useMetaMaskConnector() {
  const connector = useMemo(() => {
    const isBrowser = typeof window !== "undefined";

    // A) Desktop com extensão
    if (isBrowser && typeof window.ethereum !== "undefined") {
      return injected({
        target: () => ({
          id: "metamask-extension",
          name: "MetaMask",
          provider: window.ethereum as EIP1193Provider,
        }),
      });
    }

    // B) Mobile ou fallback: usar MetaMask SDK
    const sdk = new MetaMaskSDK({
      dappMetadata: {
        name: "MetaMask DApp",
        url: "http://localhost:3000",
      },
      useDeeplink: true,
    });

    const sdkProvider = sdk.getProvider() as EIP1193Provider;

    return injected({
      target: () => ({
        id: "metamask-sdk",
        name: "MetaMask SDK",
        provider: sdkProvider,
      }),
    });
  }, []);

  return connector;
}
