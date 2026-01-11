export type ViewState = 'landing' | 'login' | 'onboarding' | 'scanning' | 'dashboard' | 'defense' | 'ledger' | 'protection' | 'settings';

export interface IdentityRecord {
  id: string;
  name: string;
  verifiedAt: string;
  solanaHash: string;
  trustScore: number;
}

export interface Alert {
  id: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube' | 'X';
  thumbnailUrl: string; // Placeholder URL
  detectedAt: string;
  confidence: number;
  status: 'active' | 'resolved' | 'pending';
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
  detectedIncident: boolean;
  confidenceScore: number;
  defenseActivated: boolean;
  platform?: string;
  alertId?: string;
}