'use client';

import { useAccount, useChainId, useDisconnect, useSignMessage } from 'wagmi';

export function useWallet() {
  const { address, isConnected, status } = useAccount();
  const chainId = useChainId();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  return { address, isConnected, status, chainId, signMessageAsync, disconnect };
}
