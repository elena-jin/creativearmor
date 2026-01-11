import { Alert, IdentityRecord } from "./types";

export const MOCK_IDENTITY: IdentityRecord = {
  id: "did:sol:7x9...3k2",
  name: "Elena",
  verifiedAt: new Date().toISOString(),
  solanaHash: "5U3v...9jL2",
  trustScore: 98,
};

// Note: Replace these image URLs with actual images of the Pope in Balenciaga puffer jacket
export const RECENT_ALERTS: Alert[] = [
  {
    id: "AL-8821",
    platform: "TikTok",
    thumbnailUrl: "https://via.placeholder.com/400x400/1e293b/ffffff?text=Pope+in+Balenciaga+Puffer",
    detectedAt: "2 mins ago",
    confidence: 99.2,
    status: "active",
  },
  {
    id: "AL-8820",
    platform: "Instagram",
    thumbnailUrl: "https://via.placeholder.com/400x400/1e293b/ffffff?text=Pope+in+Balenciaga+Puffer",
    detectedAt: "4 hours ago",
    confidence: 87.5,
    status: "resolved",
  },
];

export const SCAN_LOGS = [
  "Initializing biometric handshake...",
  "Acquiring volumetric face mesh...",
  "Extracting 1024-point vector embeddings...",
  "Querying Solana Trust Ledger...",
  "Verifying signature authority...",
  "Consent verification: CONFIRMED",
  "Identity match: 99.98%"
];