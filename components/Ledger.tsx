import React, { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { getScanHistory } from '../services/solanaService';
import { ScanEvent } from '../types';
import { Activity, Shield, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface LedgerProps {
  onBack?: () => void;
}

export const Ledger: React.FC<LedgerProps> = ({ onBack }) => {
  const [scanHistory, setScanHistory] = useState<ScanEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      const history = await getScanHistory(20);
      setScanHistory(history);
      setLoading(false);
    };
    loadHistory();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Dashboard</span>
          </button>
        )}
        <h1 className="text-3xl font-light text-white mb-2">Trust Ledger</h1>
        <p className="text-slate-400">Complete history of all scan events and verifications</p>
      </motion.div>

      <GlassCard>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {scanHistory.map((event, index) => (
              <motion.div
                key={event.scanId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  event.detectedIncident 
                    ? 'bg-red-500/10 border border-red-500/20' 
                    : 'bg-emerald-500/10 border border-emerald-500/20'
                }`}>
                  {event.detectedIncident ? (
                    <Shield className="text-red-400" size={20} />
                  ) : (
                    <CheckCircle className="text-emerald-400" size={20} />
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">{event.scanId}</span>
                    {event.platform && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                        {event.platform}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-mono text-white mb-1">
                    {event.confidenceScore.toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-500">
                    {event.defenseActivated ? 'Defense Active' : 'No Action'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

