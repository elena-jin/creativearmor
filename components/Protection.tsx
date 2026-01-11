import React from 'react';
import { GlassCard } from './GlassCard';
import { ArrowLeft, Shield, AlertTriangle, Lock, CheckCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProtectionProps {
  onBack: () => void;
}

export const Protection: React.FC<ProtectionProps> = ({ onBack }) => {
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
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-light text-white">Active Protection</h2>
          </div>
          <p className="text-sm text-slate-400 mb-6">
            Configure your protection settings and monitoring preferences.
          </p>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-emerald-400" size={18} />
                <span className="text-sm font-medium text-white">Defense Active</span>
              </div>
              <p className="text-xs text-slate-400">Your identity is protected and monitored 24/7</p>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-amber-400" size={18} />
                <span className="text-sm font-medium text-white">Alert Threshold</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">Minimum confidence score to trigger alerts</p>
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
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Search className="text-blue-400" size={18} />
                <span className="text-sm font-medium text-white">Google Deepfake Detection</span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Web Scanning</span>
                  <CheckCircle className="text-emerald-400" size={16} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">AI Image Detection</span>
                  <CheckCircle className="text-emerald-400" size={16} />
                </div>
                <div className="text-xs text-slate-500 mt-2">Scanning TikTok, Instagram, Reddit, and web platforms</div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="text-emerald-400" size={18} />
                <span className="text-sm font-medium text-white">Platform Monitoring</span>
              </div>
              <div className="space-y-2">
                {['TikTok', 'Instagram', 'Reddit', 'YouTube', 'X (Twitter)'].map((platform) => (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{platform}</span>
                    <CheckCircle className="text-emerald-400" size={16} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
