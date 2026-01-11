import React from 'react';
import { GlassCard } from './GlassCard';
import { Shield, Lock, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProtectionProps {
  onBack?: () => void;
}

export const Protection: React.FC<ProtectionProps> = ({ onBack }) => {
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
        <h1 className="text-3xl font-light text-white mb-2">Protection Settings</h1>
        <p className="text-slate-400">Configure your active defense preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Shield className="text-blue-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">Auto-Defense</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Automatically activate defense when deepfakes are detected
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Enabled</span>
            <div className="w-12 h-6 bg-blue-500 rounded-full relative">
              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <AlertTriangle className="text-indigo-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">Alert Threshold</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Minimum confidence score to trigger alerts
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">85%</span>
            <input 
              type="range" 
              min="50" 
              max="100" 
              defaultValue="85"
              className="flex-1 ml-4"
            />
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Lock className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">Platform Monitoring</h3>
          </div>
          <div className="space-y-3">
            {['TikTok', 'Instagram', 'YouTube', 'X (Twitter)'].map((platform) => (
              <div key={platform} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{platform}</span>
                <CheckCircle className="text-emerald-400" size={16} />
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <CheckCircle className="text-purple-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">DMCA Auto-Submit</h3>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Automatically submit DMCA notices when defense is activated
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Manual Review</span>
            <div className="w-12 h-6 bg-slate-700 rounded-full relative">
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

