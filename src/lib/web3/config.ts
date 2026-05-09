import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import { hardhat, mainnet, sepolia } from 'wagmi/chains';
import { env } from '@/env';

export const wagmiConfig = getDefaultConfig({
  appName: 'web3db',
  projectId: env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'web3db-dev',
  chains: [hardhat, sepolia, mainnet],
  transports: {
    [hardhat.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
  ssr: true,
});
