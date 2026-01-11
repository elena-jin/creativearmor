// Register Proof-of-Human Origin on Solana blockchain
// Uses Memo Program to store proof data on-chain

import { Connection, Transaction, SystemProgram, PublicKey, Keypair } from '@solana/web3.js';
import { getSolanaConnection } from './connectWallet';

export interface ProofData {
  faceHash: string;
  imageHash: string;
  watermarkHash: string;
  wallet: string;
  timestamp: string;
}

/**
 * Generate face hash from face landmarks or embeddings
 * In production, this would use face recognition library
 * For demo: Uses hardcoded hash for instant performance
 * 
 * NOTE: When uploading new images, this returns a DIFFERENT hash that will fail verification
 * This simulates an unverified image that doesn't match the original registered proof
 */
export const generateFaceHash = async (imageData: string | Blob | File): Promise<string> => {
  // Check if this is a new upload (File/Blob) vs existing alert (string URL)
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
  // Check if this is a new upload (File/Blob) vs existing alert (string URL)
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
 * Memo Program allows storing arbitrary data on-chain
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

  // Create proof data
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
    // Import Memo Program instruction builder
    // Memo Program: MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr
    const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
    
    // Create transaction with memo instruction
    // Memo instruction format: [programId, signer, memo data]
    const transaction = new Transaction().add({
      keys: [{ pubkey: walletPublicKey, isSigner: true, isWritable: false }],
      programId: memoProgramId,
      data: Buffer.from(memoText, 'utf-8'),
    });

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletPublicKey;

    // Sign transaction with wallet
    if (!window.solana?.signTransaction) {
      throw new Error('Wallet does not support signing transactions');
    }

    const signedTransaction = await window.solana.signTransaction(transaction);

    // Send transaction
    const txHash = await connection.sendRawTransaction(signedTransaction.serialize(), {
      skipPreflight: false,
    });

    // Confirm transaction
    await connection.confirmTransaction(txHash, 'confirmed');

    return {
      txHash,
      proofData,
    };
  } catch (error) {
    console.error('Error registering proof on Solana:', error);
    throw error;
  }
};

