export type ViewState = 'landing' | 'login' | 'onboarding' | 'scanning' | 'dashboard' | 'defense' | 'ledger' | 'protection' | 'settings' | 'moderation';

export interface IdentityRecord {
  id: string;
  name: string;
  verifiedAt: string;
  solanaHash: string;
  trustScore: number;
}

export interface Alert {
  id: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'X' | 'Reddit' | 'Google';
  source: 'Google Deepfake Detection' | 'TikTok' | 'Instagram' | 'Reddit' | 'Upload';
  detectedLocation?: string; // URL or location where AI image was found
  thumbnailUrl: string; // Placeholder URL
  detectedAt: string;
  confidence: number;
  status: 'active' | 'resolved' | 'pending';
  reason?: 'Nudity' | 'Revealing' | 'Deepfake'; // For moderation alerts
}

export interface VerifiedImage {
  id: string;
  imageUrl: string;
  uploadedAt: string;
  hash: string; // Image hash to prevent alerts
}

export interface ModerationFilters {
  nudity: boolean;
  revealing: boolean;
  deepfake: boolean;
}

export interface DefenseLog {
  id: string;
  action: string;
  timestamp: string;
  status: 'success' | 'processing';
}

export interface ScanEvent {
  scanId: string;
  timestamp: string;
  detectedIncident: string;
  confidenceScore: number;
  defenseActivated: boolean;
}

export interface VerifiedProof {
  faceHash: string;
  imageHash: string;
  watermarkHash: string;
  wallet: string;
  timestamp: string;
  txHash: string;
  verified: boolean;
  mismatch?: boolean;
}

export interface WalletConnection {
  publicKey: string;
  connected: boolean;
}