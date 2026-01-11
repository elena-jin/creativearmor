import { Connection, PublicKey } from "@solana/web3.js";

export const isPhantomInstalled = () => {
  return typeof window !== "undefined" && "solana" in window && window.solana?.isPhantom;
};

export const getSolanaConnection = (): Connection => {
  return new Connection("https://api.devnet.solana.com", "confirmed");
};

export interface WalletConnection {
  publicKey: string;
  connected: boolean;
}

export const getCurrentWallet = async (): Promise<WalletConnection | null> => {
  if (!isPhantomInstalled()) {
    return null;
  }

  try {
    const provider = window.solana;
    if (provider.isConnected) {
      return {
        publicKey: provider.publicKey.toString(),
        connected: true,
      };
    }
    return null;
  } catch (error) {
    console.error("Error getting wallet:", error);
    return null;
  }
};

export const connectWallet = async (): Promise<WalletConnection> => {
  if (!isPhantomInstalled()) {
    throw new Error("Phantom wallet not installed. Please install Phantom from https://phantom.app");
  }

  try {
    const provider = window.solana;
    const response = await provider.connect();
    return {
      publicKey: response.publicKey.toString(),
      connected: true,
    };
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      isConnected?: boolean;
      publicKey?: PublicKey;
      connect?: () => Promise<{ publicKey: PublicKey }>;
    };
  }
}
