// Solana wallet connection for Proof-of-Human Origin
// Connects to Phantom or any injected Solana wallet

import { Connection, PublicKey } from '@solana/web3.js';

export interface WalletConnection {
  publicKey: PublicKey | null;
  connected: boolean;
  walletName: string | null;
}

// Check if Phantom wallet is installed
export const isPhantomInstalled = (): boolean => {
  return typeof window !== 'undefined' && 'solana' in window && window.solana?.isPhantom;
};

// Connect to Phantom wallet
export const connectPhantomWallet = async (): Promise<WalletConnection> => {
  if (!isPhantomInstalled()) {
    throw new Error('Phantom wallet not installed. Please install Phantom from https://phantom.app');
  }

  try {
    const provider = window.solana;
    const response = await provider.connect();
    
    return {
      publicKey: new PublicKey(response.publicKey),
      connected: true,
      walletName: 'Phantom',
    };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

// Disconnect wallet
export const disconnectWallet = async (): Promise<void> => {
  if (isPhantomInstalled()) {
    try {
      await window.solana.disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  }
};

// Get current wallet connection
export const getCurrentWallet = async (): Promise<WalletConnection | null> => {
  if (!isPhantomInstalled()) {
    return null;
  }

  try {
    const provider = window.solana;
    if (provider.isConnected) {
      return {
        publicKey: new PublicKey(provider.publicKey),
        connected: true,
        walletName: 'Phantom',
      };
    }
  } catch (error) {
    console.error('Error getting wallet:', error);
  }

  return null;
};

// Initialize Solana connection (Devnet for development)
export const getSolanaConnection = (): Connection => {
  const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  return new Connection(rpcUrl, 'confirmed');
};

// Declare window.solana type
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isConnected?: boolean;
      publicKey?: { toString(): string };
      connect(): Promise<{ publicKey: { toString(): string } }>;
      disconnect(): Promise<void>;
      signTransaction(transaction: any): Promise<any>;
      signAllTransactions(transactions: any[]): Promise<any[]>;
    };
  }
}
