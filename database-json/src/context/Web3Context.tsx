import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  isConnected: boolean;
  isMetaMaskInstalled: boolean;
  connectWallet: () => Promise<void>;
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
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected
  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setProvider(provider);
          setIsConnected(true);
        }
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        setIsMetaMaskInstalled(true);
        // Check if already connected
        await checkConnection();
      } else {
        setIsMetaMaskInstalled(false);
      }
    };

    checkMetaMask();
  }, []);

  // Disconnect wallet
  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setIsConnected(false);
    setError(null);
  };

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    setError(null);
    
    if (!isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      // Redirect to MetaMask download page
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setProvider(provider);
      setIsConnected(true);
      
      console.log('Connected to MetaMask:', address);
    } catch (error: any) {
      console.error('Error connecting to MetaMask:', error);
      if (error.code === 4001) {
        setError('Connection request was rejected by the user.');
      } else {
        setError('Failed to connect to MetaMask. Please try again.');
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
    isMetaMaskInstalled,
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
  }
}
