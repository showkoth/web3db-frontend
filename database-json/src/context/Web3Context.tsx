import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

export enum WalletType {
  METAMASK = 'metamask',
  COINBASE = 'coinbase',
  WALLETCONNECT = 'walletconnect'
}

interface WalletInfo {
  type: WalletType;
  name: string;
  icon: string;
  installed: boolean;
}

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  isConnected: boolean;
  connectedWallet: WalletType | null;
  availableWallets: WalletInfo[];
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectWallet: () => void;
  error: string | null;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<WalletType | null>(null);
  const [availableWallets, setAvailableWallets] = useState<WalletInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Check which wallets are installed
  useEffect(() => {
    const checkWallets = () => {
      const wallets: WalletInfo[] = [
        {
          type: WalletType.METAMASK,
          name: 'MetaMask',
          icon: '🦊',
          installed: typeof window !== 'undefined' && window.ethereum?.isMetaMask === true
        },
        {
          type: WalletType.COINBASE,
          name: 'Coinbase Wallet',
          icon: '🔵',
          installed: typeof window !== 'undefined' && (window.ethereum?.isCoinbaseWallet === true || (window as any).coinbaseWalletExtension !== undefined)
        }
      ];
      setAvailableWallets(wallets);
    };

    checkWallets();
  }, []);

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
    setConnectedWallet(null);
    setError(null);
  };

  // Get wallet provider based on type
  const getWalletProvider = (walletType: WalletType) => {
    if (typeof window === 'undefined') return null;

    switch (walletType) {
      case WalletType.METAMASK:
        return window.ethereum?.isMetaMask ? window.ethereum : null;
      case WalletType.COINBASE:
        // Coinbase Wallet can be accessed through ethereum object or coinbaseWalletExtension
        if (window.ethereum?.isCoinbaseWallet) {
          return window.ethereum;
        }
        // Check for Coinbase Wallet extension
        if ((window as any).coinbaseWalletExtension) {
          return (window as any).coinbaseWalletExtension;
        }
        return null;
      default:
        return null;
    }
  };

  // Connect to specified wallet
  const connectWallet = async (walletType: WalletType) => {
    setError(null);
    
    const walletInfo = availableWallets.find(w => w.type === walletType);
    if (!walletInfo?.installed) {
      const installUrls = {
        [WalletType.METAMASK]: 'https://metamask.io/download/',
        [WalletType.COINBASE]: 'https://www.coinbase.com/wallet',
        [WalletType.WALLETCONNECT]: ''
      };
      
      setError(`${walletInfo?.name || 'Wallet'} is not installed. Please install it to continue.`);
      if (installUrls[walletType]) {
        window.open(installUrls[walletType], '_blank');
      }
      return;
    }

    const walletProvider = getWalletProvider(walletType);
    if (!walletProvider) {
      setError('Wallet provider not found. Please make sure your wallet is installed and active.');
      return;
    }

    try {
      // Request account access
      await walletProvider.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(provider);
      setIsConnected(true);
      setConnectedWallet(walletType);
      
      console.log(`Connected to ${walletInfo.name}:`, address);
    } catch (error: any) {
      console.error(`Error connecting to ${walletInfo?.name}:`, error);
      if (error.code === 4001) {
        setError('Connection request was rejected by the user.');
      } else {
        setError(`Failed to connect to ${walletInfo?.name}. Please try again.`);
      }
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        if (window.ethereum) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, []);

  const contextValue: Web3ContextType = {
    account,
    provider,
    isConnected,
    connectedWallet,
    availableWallets,
    connectWallet,
    disconnectWallet,
    error
  };

  return (
    <Web3Context.Provider value={contextValue}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

// Extend window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
    coinbaseWalletExtension?: any;
  }
}
