import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { ArrowLeft, User, Mail, Bell, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [name, setName] = useState('Elena');
  const [email, setEmail] = useState('elena@example.com');
  const [notifications, setNotifications] = useState(true);

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
            <User className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-light text-white">Profile Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <div className="flex items-center gap-3 mb-6">
            <Bell className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-light text-white">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-white font-medium">Email Notifications</div>
                <div className="text-xs text-slate-400">Receive alerts via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.3}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-emerald-400" size={24} />
            <h2 className="text-2xl font-light text-white">Security</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-sm text-white font-medium mb-1">Biometric Authentication</div>
              <div className="text-xs text-slate-400">Enabled • Last verified: Just now</div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-sm text-white font-medium mb-1">Solana Wallet</div>
              <div className="text-xs text-slate-400 font-mono">Not connected</div>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};
