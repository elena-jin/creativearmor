import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, ArrowRight } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="text-white fill-white/10" size={48} />
          <h1 className="text-5xl md:text-7xl font-thin tracking-tighter text-white">CreativeArmor</h1>
        </div>
        <h2 className="text-3xl md:text-5xl font-thin tracking-tight text-white">
          Protect your <span className="text-indigo-400 font-normal">humanity</span>.
        </h2>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
          Active defense against deepfakes and identity theft using cryptographic biometric verification and Solana proof-of-human origin.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="w-full max-w-md"
      >
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full group relative px-8 py-4 bg-white text-black text-sm font-semibold tracking-wide rounded-full overflow-hidden transition-all hover:scale-105"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              CREATE ACCOUNT
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-indigo-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onLogin}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Already have an account? <span className="text-indigo-400">Sign in</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
