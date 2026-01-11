import { Connection, PublicKey } from "@solana/web3.js";
import { VerifiedProof } from "../types";

/**
 * Verify proof by querying Solana memos
 * For demo: Returns mock verification data
 */
export const verifyProof = async (
  faceHash: string,
  imageHash: string
): Promise<VerifiedProof | null> => {
  // Check if we're in demo mode
  const isDemoMode = !window.solana?.isConnected;

  if (isDemoMode) {
    // Return mock verification for demo
    // The "registered" imageHash is the original one
    const registeredImageHash = 'b7e2c9d4f1a6b8c3d5e7f2a9b4c6d8e1f3a5b7c9d2e4f6a8b1c3d5e7f9a2b4c6';
    const registeredFaceHash = 'a3f5b8c2d9e1f4a7b6c8d2e5f9a1b4c7d8e2f5a9b3c6d8e1f4a7b2c5d9e3f6a8';
    
    // Check if faceHash matches
    if (faceHash !== registeredFaceHash) {
      // No proof found
      return null;
    }
    
    // FaceHash matches, but check imageHash
    const imageHashMatches = imageHash === registeredImageHash;
    
    return {
      faceHash,
      imageHash: registeredImageHash,
      watermarkHash: 'c9f3a6b8d2e5f7a1b4c6d8e2f5a9b3c7d1e4f6a8b2c5d7e9f3a6b8c1d4e7f9',
      wallet: 'DemoWallet111111111111111111111111111111',
      timestamp: new Date().toISOString(),
      txHash: 'demo_tx_hash',
      verified: imageHashMatches,
      mismatch: !imageHashMatches,
    };
  }

  // In production, query Solana memos for proofs matching faceHash
  // This is a simplified version - in reality you'd parse memo transactions
  try {
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");
    
    // Simplified: In production, you'd query for memo transactions
    // containing the faceHash and parse the proof data
    
    // For now, return null (no proof found) or mock data
    return null;
  } catch (error) {
    console.error("Error verifying proof:", error);
    return null;
  }
};
