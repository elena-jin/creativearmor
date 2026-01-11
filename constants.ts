import { Alert, IdentityRecord } from "./types";

export const MOCK_IDENTITY: IdentityRecord = {
  id: "did:sol:7x9...3k2",
  name: "Elena",
  verifiedAt: new Date().toISOString(),
  solanaHash: "5U3v...9jL2",
  trustScore: 98,
};

export const RECENT_ALERTS: Alert[] = [
  {
    id: "AL-8821",
    platform: "TikTok",
    source: "Google Deepfake Detection",
    detectedLocation: "https://tiktok.com/@fakeuser/video/123456",
    thumbnailUrl: "https://via.placeholder.com/400x400/1e293b/ffffff?text=Elena+Deepfake+TikTok",
    detectedAt: "5 mins ago",
    confidence: 94.5,
    status: "active",
  },
  {
    id: "AL-8820",
    platform: "Reddit",
    source: "Google Deepfake Detection",
    detectedLocation: "https://reddit.com/r/fakeimages/post/789",
    thumbnailUrl: "https://via.placeholder.com/400x400/1e293b/ffffff?text=Elena+Deepfake+Reddit",
    detectedAt: "2 hours ago",
    confidence: 87.2,
    status: "active",
  },
  {
    id: "AL-8819",
    platform: "Instagram",
    source: "Google Deepfake Detection",
    detectedLocation: "https://instagram.com/p/fake123",
    thumbnailUrl: "https://via.placeholder.com/400x400/1e293b/ffffff?text=Elena+Deepfake+Instagram",
    detectedAt: "6 hours ago",
    confidence: 91.8,
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