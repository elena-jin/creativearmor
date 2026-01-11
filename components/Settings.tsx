import React from 'react';
import { GlassCard } from './GlassCard';
import { User, Bell, Key, Database, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface SettingsProps {
  onBack?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
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
        <h1 className="text-3xl font-light text-white mb-2">Settings</h1>
        <p className="text-slate-400">Manage your account and preferences</p>
      </motion.div>

      <div className="space-y-6">
        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <User className="text-blue-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">Profile</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Name</label>
              <input 
                type="text" 
                defaultValue="Elena"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-2">Email</label>
              <input 
                type="email" 
                defaultValue="elena@example.com"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
              />
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Bell className="text-indigo-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Email Alerts', enabled: true },
              { label: 'Push Notifications', enabled: false },
              { label: 'SMS Alerts', enabled: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{item.label}</span>
                <div className={`w-12 h-6 rounded-full relative ${item.enabled ? 'bg-blue-500' : 'bg-slate-700'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${item.enabled ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Key className="text-emerald-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">Security</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-colors">
              Change Password
            </button>
            <button className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-colors">
              Enable 2FA
            </button>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Database className="text-purple-400" size={20} />
            </div>
            <h3 className="text-lg font-light text-white">Data & Privacy</h3>
          </div>
          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 transition-colors text-left">
              Export Data
            </button>
            <button className="w-full px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm hover:bg-red-500/20 transition-colors text-left">
              Delete Account
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

