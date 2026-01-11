import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - any input works for demo
    if (email && password) {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 animated-gradient rounded-full animated-blob opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 animated-gradient rounded-full animated-blob opacity-30" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-72 h-72 animated-gradient rounded-full animated-blob opacity-25" style={{ animationDelay: '10s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* AI Elena Image */}
        <div className="mb-8 flex justify-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
          >
            {/* Replace this src with your AI Elena image URL */}
            <img
              src="https://via.placeholder.com/400x400/334155/ffffff?text=AI+Elena+Image"
              alt="AI Elena"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback placeholder for AI Elena image
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%23334155;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%231e293b;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="400" height="400"/%3E%3Ctext fill="%23ffffff" font-family="serif" font-size="80" x="50%25" y="45%25" text-anchor="middle"%3EAI%3C/text%3E%3Ctext fill="%23ffffff" font-family="serif" font-size="80" x="50%25" y="60%25" text-anchor="middle"%3EELENA%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 text-white text-sm font-light">
                <Shield size={16} className="text-blue-400" />
                <span>Verified Identity</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="glass-panel rounded-2xl p-8 backdrop-blur-xl border border-white/10"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-white mb-2">CreativeArmor</h1>
            <p className="text-sm text-slate-400">Active Identity Defense</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm text-slate-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="••••••••"
                  required
                />
                <Lock size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20"
            >
              Sign In
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Protected by cryptographic biometric verification
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

