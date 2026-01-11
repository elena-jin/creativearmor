import { ScanEvent } from "../types";

/**
 * Get scan history from Solana (simulated)
 * In production, this would query Solana memos or a custom program
 */
export const getScanHistory = async (limit: number = 10): Promise<ScanEvent[]> => {
  // Simulated scan history
  // In production, query Solana for actual scan events
  return [
    {
      scanId: "SCAN-001",
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      detectedIncident: "TikTok Deepfake",
      confidenceScore: 99.2,
      defenseActivated: true,
    },
    {
      scanId: "SCAN-002",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      detectedIncident: "Instagram Deepfake",
      confidenceScore: 87.5,
      defenseActivated: false,
    },
  ].slice(0, limit);
};
