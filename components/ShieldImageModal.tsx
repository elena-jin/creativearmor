import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { Shield, XCircle, CheckCircle, ExternalLink, Loader } from 'lucide-react';
import { connectPhantomWallet, getCurrentWallet, WalletConnection, isPhantomInstalled } from '../solana/connectWallet';
import { registerProof } from '../solana/registerProof';
import { getSolanaConnection } from '../solana/connectWallet';
import { PublicKey } from '@solana/web3.js';

interface ShieldImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (txHash: string, imageFile?: File | Blob) => void;
  imageFile?: File | Blob;
}

export const ShieldImageModal: React.FC<ShieldImageModalProps> = ({ isOpen, onClose, onComplete, imageFile }) => {
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [step, setStep] = useState<'connect' | 'registering' | 'success' | 'error'>('connect');
  const [txHash, setTxHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check for wallet on mount and auto-start demo mode if no wallet
  useEffect(() => {
    if (isOpen && imageFile) {
      const checkWallet = async () => {
        const currentWallet = await getCurrentWallet();
        if (currentWallet) {
          setWallet(currentWallet);
          // Auto-proceed if wallet already connected
          setStep('registering');
          const connection = getSolanaConnection();
          registerProof(imageFile, currentWallet.publicKey!, connection)
            .then(result => {
              setTxHash(result.txHash);
              setStep('success');
              onComplete?.(result.txHash, imageFile);
            })
            .catch(() => {
              // Fall back to demo mode
              setIsDemoMode(true);
              const mockPublicKey = new PublicKey('DemoWallet111111111111111111111111111111');
              registerProof(imageFile, mockPublicKey, connection)
                .then(result => {
                  setTxHash(result.txHash);
                  setStep('success');
                  onComplete?.(result.txHash, imageFile);
                })
                .catch(err => {
                  setError(err.message || 'Failed to register proof');
                  setStep('error');
                });
            });
        } else if (!isPhantomInstalled()) {
          // Auto-start demo mode if no Phantom
          setIsDemoMode(true);
          setStep('registering');
          const mockPublicKey = new PublicKey('DemoWallet111111111111111111111111111111');
          const connection = getSolanaConnection();
          registerProof(imageFile, mockPublicKey, connection)
            .then(result => {
              setTxHash(result.txHash);
              setStep('success');
              onComplete?.(result.txHash, imageFile);
            })
            .catch(err => {
              setError(err.message || 'Failed to register proof');
              setStep('error');
            });
        }
      };
      checkWallet();
    }
  }, [isOpen, imageFile, onComplete]);

  const handleConnectWallet = async () => {
    try {
      setError('');
      setIsDemoMode(false);
      const connected = await connectPhantomWallet();
      setWallet(connected);
      setStep('registering');
      
      // Automatically proceed to register proof
      if (imageFile) {
        await handleRegisterProof(connected);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      // Fall back to demo mode on error
      setIsDemoMode(true);
      if (imageFile) {
        handleRegisterProofDemo();
      } else {
        setStep('error');
      }
    }
  };

  const handleRegisterProof = async (walletConnection: WalletConnection) => {
    if (!imageFile) {
      setError('Missing image file');
      setStep('error');
      return;
    }

    if (!walletConnection.publicKey) {
      // Fall back to demo mode
      handleRegisterProofDemo();
      return;
    }

    try {
      setStep('registering');
      const connection = getSolanaConnection();
      const result = await registerProof(imageFile, walletConnection.publicKey, connection);
      
      setTxHash(result.txHash);
      setStep('success');
      onComplete?.(result.txHash);
    } catch (err: any) {
      console.error('Error registering proof:', err);
      // Fall back to demo mode on error
      setIsDemoMode(true);
      handleRegisterProofDemo();
    }
  };

  const handleRegisterProofDemo = async () => {
    if (!imageFile) {
      setError('Missing image file');
      setStep('error');
      return;
    }

    try {
      setStep('registering');
      setIsDemoMode(true);
      
      // Use demo mode - create mock wallet and register
      const mockPublicKey = new PublicKey('DemoWallet111111111111111111111111111111');
      const connection = getSolanaConnection();
      const result = await registerProof(imageFile, mockPublicKey, connection);
      
      setTxHash(result.txHash);
      setStep('success');
      onComplete?.(result.txHash);
    } catch (err: any) {
      setError(err.message || 'Failed to register proof');
      setStep('error');
    }
  };

  const handleClose = () => {
    setStep('connect');
    setWallet(null);
    setTxHash('');
    setError('');
    setIsDemoMode(false);
    onClose();
  };

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('connect');
      setWallet(null);
      setTxHash('');
      setError('');
      setIsDemoMode(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Shield className="text-purple-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-light text-white">Shield Image on Solana</h2>
              <p className="text-xs text-slate-400">Proof of Human Origin Registry</p>
            </div>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">
            <XCircle size={20} />
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <p className="text-sm text-slate-300">
                {isPhantomInstalled() 
                  ? 'Connect your Solana wallet to register this image on the blockchain as proof of human origin.'
                  : 'Register this image as proof of human origin. Demo mode will be used (no wallet required).'}
              </p>
              {isPhantomInstalled() ? (
                <button
                  onClick={handleConnectWallet}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all flex items-center justify-center gap-2"
                >
                  <Shield size={18} />
                  Connect Wallet & Shield Image
                </button>
              ) : (
                <button
                  onClick={handleRegisterProofDemo}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all flex items-center justify-center gap-2"
                >
                  <Shield size={18} />
                  Shield Image (Demo Mode)
                </button>
              )}
            </motion.div>
          )}

          {step === 'registering' && (
            <motion.div
              key="registering"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 text-center"
            >
              <div className="flex flex-col items-center gap-4">
                <Loader className="text-purple-400 animate-spin" size={32} />
                <div>
                  <p className="text-sm font-medium text-white mb-1">
                    Establishing Proof of Human Origin on Solana...
                  </p>
                  <p className="text-xs text-slate-400">
                    {isDemoMode 
                      ? 'Generating proof hashes (demo mode)...'
                      : 'Generating face hash, image hash, and watermark hash'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="text-emerald-400" size={32} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">
                    Image Shielded Successfully
                  </p>
                  <p className="text-xs text-slate-400">
                    {isDemoMode 
                      ? 'Your image proof has been generated (demo mode - no wallet required)'
                      : 'Your image is now registered on the Solana blockchain'}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-xs text-slate-400 mb-1">Transaction Hash</div>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-white font-mono flex-1 truncate">
                    {txHash}
                  </code>
                  {txHash.startsWith('solana_') && !isDemoMode && (
                    <a
                      href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {isDemoMode && (
                    <span className="text-xs text-slate-500">(Demo Mode)</span>
                  )}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Done
              </button>
            </motion.div>
          )}

          {step === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <XCircle className="text-red-400" size={32} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white mb-1">
                    Registration Failed
                  </p>
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setStep('connect');
                  setError('');
                }}
                className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-slate-100 transition-colors"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </div>
  );
};

