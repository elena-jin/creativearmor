import React from 'react';
import { GlassCard } from './GlassCard';
import { ArrowLeft, Fingerprint, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LedgerProps {
  onBack: () => void;
}

export const Ledger: React.FC<LedgerProps> = ({ onBack }) => {
  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <GlassCard delay={0.1}>
          <div className="flex items-center gap-3 mb-6">
            <Fingerprint className="text-emerald-400" size={24} />
            <h2 className="text-2xl font-light text-white">Identity Ledger</h2>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Immutable record of all identity verifications and proof registrations on Solana.
          </p>

          <div className="space-y-3">
            {[
              { hash: '0x7f...3a92', type: 'Biometric Verification', time: '2m ago', status: 'verified' },
              { hash: '0x9a...4b81', type: 'Image Shield', time: '1h ago', status: 'verified' },
              { hash: '0x5c...2d93', type: 'Face Hash Registration', time: '3h ago', status: 'verified' },
            ].map((entry, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/5">
                <CheckCircle className="text-emerald-400 flex-shrink-0" size={18} />
                <div className="flex-1">
                  <div className="text-sm text-white font-medium">{entry.type}</div>
                  <div className="text-xs text-slate-400 font-mono mt-1">{entry.hash}</div>
                </div>
                <div className="text-xs text-slate-500">{entry.time}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
