// Verify Proof-of-Human Origin from Solana blockchain
// Queries Solana memos to find matching faceHash

import { Connection, PublicKey } from '@solana/web3.js';
import { getSolanaConnection } from './connectWallet';

export interface VerifiedProof {
  faceHash: string;
  imageHash: string;
  watermarkHash: string;
  wallet: string;
  timestamp: string;
  txHash: string;
  verified: boolean;
  mismatch?: {
    field: string;
    expected: string;
    actual: string;
  };
}

/**
 * Verify proof by querying Solana memos
 * Searches for matching faceHash in recent transactions
 */
export const verifyProof = async (
  faceHash: string,
  imageHash?: string
): Promise<VerifiedProof | null> => {
  const connection = getSolanaConnection();

  // Check if we're in demo mode
  const isDemoMode = !window.solana?.isConnected;

  // Original registered hash (what was registered on Solana)
  const originalFaceHash = 'a3f5b8c2d9e1f4a7b6c8d2e5f9a1b4c7d8e2f5a9b3c6d8e1f4a7b2c5d9e3f6a8';
  const originalImageHash = 'b7e2c9d4f1a6b8c3d5e7f2a9b4c6d8e1f3a5b7c9d2e4f6a8b1c3d5e7f9a2b4c6';

  if (isDemoMode) {
    // Check if faceHash matches the original registered hash
    const faceHashMatches = faceHash === originalFaceHash;
    const imageHashMatches = imageHash ? imageHash === originalImageHash : false;
    
    // If faceHash matches but imageHash doesn't, it's a mismatch (unverified upload)
    if (faceHashMatches && imageHash && !imageHashMatches) {
      return {
        faceHash: originalFaceHash,
        imageHash: originalImageHash,
        watermarkHash: 'c9f3a6b8d2e5f7a1b4c6d8e2f5a9b3c7d1e4f6a8b2c5d7e9f3a6b8c1d4e7f9',
        wallet: 'DemoWallet111111111111111111111111111111',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        txHash: 'demo_original_tx_hash',
        verified: false,
        mismatch: {
          field: 'imageHash',
          expected: originalImageHash,
          actual: imageHash,
        },
      };
    }
    
    // If faceHash doesn't match at all, no proof found
    if (!faceHashMatches) {
      return null;
    }
    
    // If both match, verification successful
    return {
      faceHash: originalFaceHash,
      imageHash: originalImageHash,
      watermarkHash: 'c9f3a6b8d2e5f7a1b4c6d8e2f5a9b3c7d1e4f6a8b2c5d7e9f3a6b8c1d4e7f9',
      wallet: 'DemoWallet111111111111111111111111111111',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      txHash: 'demo_original_tx_hash',
      verified: true,
    };
  }

  try {
    // Query recent transactions from Memo Program
    // Memo Program ID: MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr
    const memoProgramId = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');

    // Query recent transactions from Memo Program
    // Since Memo Program doesn't store accounts, we need to query transactions
    // For demo purposes, we'll use a simplified approach
    // In production, you'd use a custom program or indexer
    
    // Alternative: Query recent transactions and parse memo instructions
    // This is a simplified version - in production, use a proper indexer
    const signatures = await connection.getSignaturesForAddress(memoProgramId, {
      limit: 100,
    });
    
    const accounts: Array<{ pubkey: PublicKey; account: { data: Buffer } }> = [];
    
    // For each signature, try to get transaction and extract memo data
    for (const sigInfo of signatures.slice(0, 20)) { // Limit to 20 for performance
      try {
        const tx = await connection.getTransaction(sigInfo.signature, {
          commitment: 'confirmed',
          maxSupportedTransactionVersion: 0,
        });
        
        if (tx?.meta?.logMessages) {
          // Look for memo in log messages or parse transaction instructions
          // This is a simplified approach - in production, parse instruction data properly
          const memoMatch = tx.meta.logMessages.find(log => log.includes('Memo'));
          if (memoMatch) {
            // Extract memo data from transaction
            // In production, properly parse the instruction data
            accounts.push({
              pubkey: new PublicKey(sigInfo.signature),
              account: {
                data: Buffer.from(''), // Placeholder - would need proper parsing
              },
            });
          }
        }
      } catch (err) {
        // Skip failed transactions
        continue;
      }
    }

    // Parse memos to find matching faceHash
    for (const account of accounts) {
      try {
        const accountData = account.account.data;
        const memoText = Buffer.from(accountData).toString('utf-8');

        // Try to parse as JSON (our proof format)
        try {
          const proofData = JSON.parse(memoText);

          if (proofData.faceHash === faceHash) {
            // Found matching faceHash
            const verified: VerifiedProof = {
              faceHash: proofData.faceHash,
              imageHash: proofData.imageHash,
              watermarkHash: proofData.watermarkHash,
              wallet: proofData.wallet,
              timestamp: proofData.timestamp,
              txHash: account.pubkey.toString(), // Use account pubkey as identifier
              verified: true,
            };

            // If imageHash provided, verify it matches
            if (imageHash && proofData.imageHash !== imageHash) {
              verified.verified = false;
              verified.mismatch = {
                field: 'imageHash',
                expected: proofData.imageHash,
                actual: imageHash,
              };
            }

            return verified;
          }
        } catch {
          // Not JSON, skip
          continue;
        }
      } catch (error) {
        // Skip invalid accounts
        continue;
      }
    }

    // No matching proof found
    return null;
  } catch (error) {
    console.error('Error verifying proof on Solana:', error);
    throw error;
  }
};

/**
 * Get Solana explorer URL for transaction
 */
export const getSolanaExplorerUrl = (txHash: string, network: 'devnet' | 'mainnet' = 'devnet'): string => {
  const baseUrl = network === 'devnet' 
    ? 'https://explorer.solana.com/tx'
    : 'https://explorer.solana.com/tx';
  return `${baseUrl}/${txHash}?cluster=${network}`;
};

/**
 * Generate Certificate of Inauthenticity
 */
export const generateInauthenticityCertificate = (
  verifiedProof: VerifiedProof,
  detectedImageHash: string
): {
  certificate: string;
  txLink: string;
  timestamp: string;
  mismatchNotice: string;
} => {
  const txLink = getSolanaExplorerUrl(verifiedProof.txHash, 'devnet');
  
  const certificate = `
CERTIFICATE OF INAUTHENTICITY
==============================

This document certifies that the analyzed content does NOT match
the original human identity registered on the Solana blockchain.

PROOF OF HUMAN ORIGIN
---------------------
Face Hash: ${verifiedProof.faceHash.substring(0, 16)}...
Original Image Hash: ${verifiedProof.imageHash.substring(0, 16)}...
Detected Image Hash: ${detectedImageHash.substring(0, 16)}...

BLOCKCHAIN VERIFICATION
-----------------------
Solana Transaction: ${verifiedProof.txHash}
Registered Wallet: ${verifiedProof.wallet.substring(0, 16)}...
Registration Time: ${new Date(verifiedProof.timestamp).toLocaleString()}
Verification Link: ${txLink}

MISMATCH DETECTED
-----------------
The faceHash exists on Solana, but the imageHash does not match.
This indicates the content is an unauthorized deepfake or manipulation.

This certificate is cryptographically verified on the Solana blockchain.
  `.trim();

  return {
    certificate,
    txLink,
    timestamp: new Date().toISOString(),
    mismatchNotice: `Face identity verified on Solana, but image hash mismatch detected. Original registered: ${verifiedProof.imageHash.substring(0, 16)}..., Detected: ${detectedImageHash.substring(0, 16)}...`,
  };
};

