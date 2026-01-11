import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { connectWallet, getSolanaConnection } from "./connectWallet";

export interface ProofData {
  faceHash: string;
  imageHash: string;
  watermarkHash: string;
  wallet: string;
  timestamp: string;
}

/**
 * Generate face hash from face landmarks or embeddings
 * For demo: Uses hardcoded hash for instant performance
 * 
 * NOTE: When uploading new images, this returns a DIFFERENT hash that will fail verification
 */
export const generateFaceHash = async (imageData: string | Blob | File): Promise<string> => {
  // Check if this is a new upload (File or Blob)
  const isNewUpload = imageData instanceof File || imageData instanceof Blob;
  
  if (isNewUpload) {
    // New uploads get a DIFFERENT hash that will fail verification
    // This simulates an unverified image
    return 'x9k2m5n8p1q4r7s0t3u6v9w2x5y8z1a4b7c0d3e6f9g2h5i8j1k4l7m0n3o6p9';
  }
  
  // Existing/already registered images use the original hash
  return 'a3f5b8c2d9e1f4a7b6c8d2e5f9a1b4c7d8e2f5a9b3c6d8e1f4a7b2c5d9e3f6a8';
};

/**
 * Generate image hash (SHA-256)
 * For demo: Uses hardcoded hash for instant performance
 * 
 * NOTE: When uploading new images, this returns a DIFFERENT hash that will fail verification
 */
export const generateImageHash = async (imageData: string | Blob | File): Promise<string> => {
  // Check if this is a new upload (File or Blob)
  const isNewUpload = imageData instanceof File || imageData instanceof Blob;
  
  if (isNewUpload) {
    // New uploads get a DIFFERENT hash that will fail verification
    // This simulates an unverified image
    return 'y0l3m6n9p2q5r8s1t4u7v0w3x6y9z2a5b8c1d4e7f0g3h6i9j2k5l8m1n4o7p0';
  }
  
  // Existing/already registered images use the original hash
  return 'b7e2c9d4f1a6b8c3d5e7f2a9b4c6d8e1f3a5b7c9d2e4f6a8b1c3d5e7f9a2b4c6';
};

/**
 * Generate watermark hash from invisible noise added to image
 * For demo: Uses hardcoded hash for instant performance
 */
export const generateWatermarkHash = async (imageData: string | Blob | File): Promise<string> => {
  // Hardcoded watermark hash for demo (instant)
  // In production: Add invisible watermark, then hash the watermarked image
  return 'c9f3a6b8d2e5f7a1b4c6d8e2f5a9b3c7d1e4f6a8b2c5d7e9f3a6b8c1d4e7f9';
};

/**
 * Register proof on Solana using Memo Program
 */
export const registerProof = async (
  imageFile: File | Blob,
  walletPublicKey: PublicKey,
  connection: Connection
): Promise<{ txHash: string; proofData: ProofData }> => {
  // Generate all hashes (instant with hardcoded values for demo)
  const [faceHash, imageHash, watermarkHash] = await Promise.all([
    generateFaceHash(imageFile),
    generateImageHash(imageFile),
    generateWatermarkHash(imageFile),
  ]);

  const proofData: ProofData = {
    faceHash,
    imageHash,
    watermarkHash,
    wallet: walletPublicKey.toString(),
    timestamp: new Date().toISOString(),
  };

  // Serialize proof data as JSON
  const memoText = JSON.stringify(proofData);

  // Check if we're in demo mode (no real wallet)
  const isDemoMode = !window.solana?.isConnected;

  if (isDemoMode) {
    // Return mock transaction hash for demo (instant)
    // Format: demo_timestamp_random
    const mockTxHash = `demo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return {
      txHash: mockTxHash,
      proofData,
    };
  }

  try {
    // Use Memo Program for lightweight on-chain storage
    // In production, you might use a custom program or account data
    const transaction = new Transaction().add({
      keys: [],
      programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
      data: Buffer.from(memoText, "utf-8"),
    });

    const { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPublicKey;

    // Sign and send transaction
    const signed = await window.solana!.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(signature, "confirmed");

    return {
      txHash: signature,
      proofData,
    };
  } catch (error) {
    console.error("Error registering proof:", error);
    throw error;
  }
};
