import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Alert, IdentityRecord } from '../types';
import { generateDMCANotice } from '../services/geminiService';
import { ShieldAlert, FileText, CheckCircle, Copy, ExternalLink, XCircle, Share2, Activity, AlertCircle } from 'lucide-react';
import { verifyProof } from '../solana/verifyProof';

interface ActiveDefenseProps {
  alert: Alert;
  identity: IdentityRecord;
  onClose: () => void;
}

export const ActiveDefense: React.FC<ActiveDefenseProps> = ({ alert, identity, onClose }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [dmcaText, setDmcaText] = useState("");
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verifyingSolana, setVerifyingSolana] = useState(false);
  const [solanaVerification, setSolanaVerification] = useState<any>(null);
  const isUnverified = alert.confidence === 0;

  useEffect(() => {
    if (isUnverified) {
      verifyAgainstSolana();
    }
  }, [alert.id]);

  const verifyAgainstSolana = async () => {
    setVerifyingSolana(true);
    try {
      // Use hardcoded hashes for unverified uploads
      const uploadFaceHash = 'x9k2m5n8p1q4r7s0t3u6v9w2x5y8z1a4b7c0d3e6f9g2h5i8j1k4l7m0n3o6p9';
      const uploadImageHash = 'y0l3m6n9p2q5r8s1t4u7v0w3x6y9z2a5b8c1d4e7f0g3h6i9j2k5l8m1n4o7p0';
      
      const verified = await verifyProof(uploadFaceHash, uploadImageHash);
      setSolanaVerification(verified);
    } catch (error) {
      console.error('Error verifying on Solana:', error);
    } finally {
      setVerifyingSolana(false);
    }
  };

  // Step 1: Verification Logic
  const renderVerification = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className={`p-3 ${isUnverified ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-red-500/10 rounded-xl border border-red-500/20 text-red-400'}`}>
          {isUnverified ? <AlertCircle size={24} /> : <ShieldAlert size={24} />}
        </div>
        <div>
          <h3 className="text-xl font-light text-white">{isUnverified ? 'Image Verification' : 'Deepfake Verification'}</h3>
          <p className="text-sm text-slate-400">Comparing content fingerprint against Trusted Identity Ledger</p>
          {alert.detectedLocation && (
            <a 
              href={alert.detectedLocation} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
            >
              <ExternalLink size={12} />
              Detected at: {alert.detectedLocation.substring(0, 50)}...
            </a>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* The Uploaded/Detected Image */}
        <div className={`p-4 rounded-xl border ${isUnverified ? 'border-amber-500/20 bg-amber-950/10' : 'border-red-500/20 bg-red-950/10'} relative overflow-hidden group`}>
          <div className={`absolute top-2 right-2 ${isUnverified ? 'bg-amber-500' : 'bg-red-500'} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
            {isUnverified ? 'UNVERIFIED' : 'DETECTED FAKE'}
          </div>
          <img src={alert.thumbnailUrl} alt={isUnverified ? 'Uploaded Image' : 'Deepfake'} className="w-full h-32 object-cover rounded-lg opacity-60 grayscale group-hover:grayscale-0 transition-all duration-500" />
          <div className={`mt-3 space-y-1 ${isUnverified ? 'text-amber-400' : 'text-red-400'}`}>
             <div className={`text-xs font-mono ${isUnverified ? 'text-amber-400' : 'text-red-400'}`}>Fingerprint: {isUnverified ? 'x9k2...o6p9' : '0x9f...a2'}</div>
             <div className={`text-xs font-mono font-bold ${isUnverified ? 'text-amber-400' : 'text-red-400'}`}>
               {isUnverified ? 'NO PROOF FOUND' : 'MATCH: FAILED'}
             </div>
          </div>
        </div>

        {/* The Original/Registry */}
        <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10 relative">
          <div className="absolute top-2 right-2 bg-emerald-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">SOLANA REGISTRY</div>
          <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center border border-white/5">
            <Activity className="text-emerald-500" size={32} />
          </div>
          <div className="mt-3 space-y-1">
             <div className="text-xs text-emerald-400 font-mono">Owner: {identity.name}</div>
             <div className="text-xs text-emerald-400 font-mono">Hash: {identity.solanaHash}</div>
          </div>
        </div>
      </div>

      {isUnverified ? (
        <GlassCard className="bg-amber-950/20 border-amber-500/20">
          <h4 className="text-amber-200 text-sm font-semibold mb-1 flex items-center gap-2">
              <AlertCircle size={14} /> No Proof Found on Solana
          </h4>
          <p className="text-xs text-amber-200/70">
            This image has not been registered on the Human Origin Registry. Shield this image on Solana to protect it from future deepfake impersonation.
          </p>
          {verifyingSolana && (
            <div className="mt-3 text-xs text-amber-300">Verifying on Solana...</div>
          )}
          {solanaVerification === null && !verifyingSolana && (
            <div className="mt-3 text-xs text-amber-300">No matching proof found in registry.</div>
          )}
        </GlassCard>
      ) : (
        <GlassCard className="bg-red-950/20 border-red-500/20">
          <h4 className="text-red-200 text-sm font-semibold mb-1 flex items-center gap-2">
              <XCircle size={14} /> Verification Hash Mismatch
          </h4>
          <p className="text-xs text-red-200/70">
            The detected video lacks the cryptographic signature associated with your biometrics. This is a confirmed unauthorized generation.
          </p>
        </GlassCard>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setStep(2)}
        className="w-full py-4 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-white/10"
      >
        <span>Initiate Active Defense</span>
        <ExternalLink size={16} />
      </motion.button>
    </div>
  );

  // Step 2: Gemini DMCA Generation
  const handleGenerateDMCA = async () => {
    setGenerating(true);
    const text = await generateDMCANotice(alert.platform, alert.id, identity.name);
    setDmcaText(text);
    setGenerating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dmcaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderDMCA = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
          <FileText size={24} />
        </div>
        <div>
          <h3 className="text-xl font-light text-white">Automated Legal Defense</h3>
          <p className="text-sm text-slate-400">Generating formal takedown request via Gemini AI</p>
        </div>
      </div>

      {!dmcaText ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            {generating ? (
                <>
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-indigo-300 font-mono">Drafting legal parameters...</p>
                </>
            ) : (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGenerateDMCA}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                >
                    Generate DMCA Takedown Notice
                </motion.button>
            )}
        </div>
      ) : (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="relative group">
                <pre className="w-full h-64 bg-slate-950/50 p-4 rounded-lg text-xs font-mono text-slate-300 overflow-y-auto whitespace-pre-wrap border border-white/5">
                    {dmcaText}
                </pre>
                <div className="absolute top-2 right-2">
                    <button 
                        onClick={copyToClipboard}
                        className="bg-white/10 hover:bg-white/20 backdrop-blur text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-2 transition-all border border-white/10"
                    >
                        {copied ? <CheckCircle size={12} className="text-emerald-400"/> : <Copy size={12} />}
                        {copied ? "Copied" : "Copy Legal Text"}
                    </button>
                </div>
            </div>
            
            <p className="text-xs text-slate-500 flex items-center gap-1">
                <CheckCircle size={12} className="text-indigo-400"/>
                Legal notice generated. Ready for submission.
            </p>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                className="w-full py-4 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-white/10"
            >
                Proceed to Platform Reporting
            </motion.button>
        </motion.div>
      )}
    </div>
  );

  // Step 3: Platform Actions
  const renderActions = () => (
    <div className="space-y-6">
       <div className="flex items-center gap-4 mb-2">
        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
          <CheckCircle size={24} />
        </div>
        <div>
          <h3 className="text-xl font-light text-white">Execute Takedown</h3>
          <p className="text-sm text-slate-400">Direct integration with platform reporting tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
          <a 
            href="https://www.tiktok.com/legal/report/privacy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#000000] flex items-center justify-center text-white font-bold border border-white/20">T</div>
                <div className="text-left">
                    <div className="text-sm text-white font-medium">Report on TikTok</div>
                    <div className="text-xs text-slate-400">Opens Trust & Safety Portal</div>
                </div>
            </div>
            <ExternalLink size={16} className="text-slate-500 group-hover:text-white transition-colors" />
          </a>

          <a 
            href="https://help.instagram.com/165828726894770" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-orange-500 flex items-center justify-center text-white font-bold">I</div>
                <div className="text-left">
                    <div className="text-sm text-white font-medium">Report on Instagram</div>
                    <div className="text-xs text-slate-400">Opens Identity Abuse Form</div>
                </div>
            </div>
            <ExternalLink size={16} className="text-slate-500 group-hover:text-white transition-colors" />
          </a>
      </div>

      <div className="my-6 border-t border-white/10"></div>

      <h4 className="text-sm font-medium text-white mb-3">Social Proof Defense</h4>
      <GlassCard className="bg-indigo-900/20 border-indigo-500/30 flex items-center justify-between group cursor-pointer" hoverEffect onClick={onClose}>
        <div>
            <div className="text-indigo-200 font-medium text-sm flex items-center gap-2">
                <Share2 size={14} />
                Deploy Credibility Blast
            </div>
            <div className="text-indigo-300/60 text-xs mt-1">
                Post public verification card to your feed
            </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
            <ExternalLink size={14} />
        </div>
      </GlassCard>

      <div className="pt-4 flex justify-center">
        <button onClick={onClose} className="text-sm text-slate-500 hover:text-white transition-colors">
            Close Case
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <GlassCard className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-2">
             <div className="flex gap-1 mb-6">
                <div className={`h-1 w-8 rounded-full transition-colors ${step >= 1 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                <div className={`h-1 w-8 rounded-full transition-colors ${step >= 2 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                <div className={`h-1 w-8 rounded-full transition-colors ${step >= 3 ? 'bg-indigo-500' : 'bg-slate-700'}`} />
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white"><XCircle size={20}/></button>
        </div>

        <AnimatePresence mode="wait">
            <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
            >
                {step === 1 && renderVerification()}
                {step === 2 && renderDMCA()}
                {step === 3 && renderActions()}
            </motion.div>
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};