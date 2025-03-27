"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";

export default function ConnectWallet() {
    const { address } = useAccount()
    const { connectors, connect } = useConnect()
    const { disconnect } = useDisconnect()
  
    return (
      <div>
        {address ? (
          <button onClick={() => disconnect()}>Disconnect</button>
        ) : (
          connectors.map((connector) => (
            <button key={connector.uid} onClick={() => connect({ connector })}>
              {connector.name}
            </button>
          ))
        )}
      </div>
    )
}
