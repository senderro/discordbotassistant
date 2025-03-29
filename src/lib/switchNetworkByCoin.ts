// lib/switchNetworkByCoin.ts
import { getChainIdFromCoin } from "./network";
import { useSwitchChain, useChainId } from "wagmi";

/**
 * Retorna uma função para forçar a troca de rede baseado no coinType.
 */
export function useAutoSwitchNetworkHandler() {
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  function switchIfNecessary(coinType?: string) {
    if (!coinType) return;

    const requiredChainId = getChainIdFromCoin(coinType);

    if (requiredChainId !== chainId) {
      switchChain({ chainId: requiredChainId });
    }
  }

  return switchIfNecessary;
}
