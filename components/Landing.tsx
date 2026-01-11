import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight, Lock, Fingerprint } from 'lucide-react';

interface LandingProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onSignUp, onLogin }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name) {
      onSignUp();
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

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Hero content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            >
              <Shield className="text-blue-400" size={18} />
              <span className="text-sm text-slate-300">Active Identity Defense</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-thin tracking-tighter text-white mb-6">
              Protect your <span className="text-blue-400 font-normal">digital identity</span>
            </h1>
            <p className="text-lg text-slate-400 mb-8 font-light leading-relaxed">
              CreativeArmor provides active defense against deepfakes and identity theft using cryptographic biometric verification. Secure your presence in the age of AI.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Fingerprint size={16} className="text-blue-400" />
                </div>
                <span className="text-sm">Biometric verification on Solana blockchain</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Lock size={16} className="text-blue-400" />
                </div>
                <span className="text-sm">Automated DMCA takedown requests</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Shield size={16} className="text-blue-400" />
                </div>
                <span className="text-sm">Real-time deepfake detection</span>
              </div>
            </div>
          </motion.div>

          {/* Right side - Sign up form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="glass-panel rounded-2xl p-8 backdrop-blur-xl border border-white/10"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-white mb-2">Create Account</h2>
              <p className="text-sm text-slate-400">Start protecting your identity today</p>
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm text-slate-300 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  placeholder="Your name"
                  required
                />
              </div>

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

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <span>Create Account</span>
                <ArrowRight size={18} />
              </motion.button>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-slate-400 mb-3">Already have an account?</p>
              <button
                onClick={onLogin}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Sign in instead
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500">
                By creating an account, you agree to our terms of service
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
