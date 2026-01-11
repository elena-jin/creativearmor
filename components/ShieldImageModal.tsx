import React, { useState, useEffect } from 'react';
import { X, Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { connectWallet, getCurrentWallet, WalletConnection } from '../solana/connectWallet';
import { registerProof, generateFaceHash, generateImageHash } from '../solana/registerProof';
import { getSolanaConnection } from '../solana/connectWallet';
import { PublicKey } from '@solana/web3.js';

interface ShieldImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (txHash: string, imageFile?: File) => void;
  imageFile?: File | Blob;
}

export const ShieldImageModal: React.FC<ShieldImageModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  imageFile: propImageFile,
}) => {
  const [step, setStep] = useState<'connect' | 'upload' | 'registering' | 'success' | 'error'>('connect');
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(propImageFile || null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [faceHash, setFaceHash] = useState<string | null>(null);
  const [imageHash, setImageHash] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Check for existing wallet connection
      getCurrentWallet().then((w) => {
        if (w) {
          setWallet(w);
          if (propImageFile) {
            setStep('registering');
            handleRegisterProof(propImageFile, w.publicKey);
          } else {
            setStep('upload');
          }
        } else {
          // Auto-start demo mode if no wallet
          if (propImageFile) {
            setStep('registering');
            handleRegisterProof(propImageFile, 'DemoWallet111111111111111111111111111111');
          }
        }
      });
    } else {
      // Reset on close
      setStep('connect');
      setWallet(null);
      setImageFile(null);
      setTxHash(null);
      setError(null);
      setFaceHash(null);
      setImageHash(null);
    }
  }, [isOpen, propImageFile]);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      const connected = await connectWallet();
      setWallet(connected);
      if (imageFile) {
        setStep('registering');
        handleRegisterProof(imageFile, connected.publicKey);
      } else {
        setStep('upload');
      }
    } catch (err: any) {
      // Auto-fallback to demo mode
      console.log('Wallet connection failed, using demo mode');
      const demoWallet: WalletConnection = {
        publicKey: 'DemoWallet111111111111111111111111111111',
        connected: false,
      };
      setWallet(demoWallet);
      if (imageFile) {
        setStep('registering');
        handleRegisterProof(imageFile, demoWallet.publicKey);
      } else {
        setStep('upload');
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      if (wallet) {
        setStep('registering');
        handleRegisterProof(file, wallet.publicKey);
      } else {
        setStep('registering');
        handleRegisterProof(file, 'DemoWallet111111111111111111111111111111');
      }
    }
  };

  const handleRegisterProof = async (file: File | Blob, walletPubKey: string) => {
    try {
      setError(null);
      setStep('registering');

      // Generate hashes
      const [fh, ih] = await Promise.all([
        generateFaceHash(file),
        generateImageHash(file),
      ]);
      setFaceHash(fh);
      setImageHash(ih);

      // Create mock PublicKey for demo mode
      let publicKey: PublicKey;
      if (walletPubKey === 'DemoWallet111111111111111111111111111111') {
        publicKey = new PublicKey('11111111111111111111111111111111');
      } else {
        publicKey = new PublicKey(walletPubKey);
      }

      const connection = getSolanaConnection();
      const result = await registerProof(file, publicKey, connection);

      setTxHash(result.txHash);
      setStep('success');

      // Call onComplete after a brief delay
      setTimeout(() => {
        onComplete(result.txHash, file instanceof File ? file : undefined);
      }, 1500);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register proof');
      setStep('error');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="text-purple-400" size={24} />
              <h2 className="text-xl font-light text-white">Shield Image on Solana</h2>
            </div>

            {step === 'connect' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Connect your Solana wallet to register this image on the Human Origin Registry.
                </p>
                <button
                  onClick={handleConnectWallet}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Shield size={18} /> Connect Wallet
                </button>
                <p className="text-xs text-center text-slate-500">
                  Demo mode available if wallet not installed
                </p>
              </div>
            )}

            {step === 'upload' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-400">
                  Wallet connected: <span className="font-mono text-white text-xs">{wallet?.publicKey.substring(0, 8)}...</span>
                </p>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="w-full py-12 border-2 border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500/50 transition-colors">
                    <Shield size={32} className="text-slate-400 mb-2" />
                    <span className="text-sm text-slate-400">Click to select image</span>
                  </div>
                </label>
              </div>
            )}

            {step === 'registering' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-8">
                  <Loader className="text-purple-400 animate-spin" size={32} />
                </div>
                <p className="text-sm text-center text-slate-400">
                  Establishing Proof of Human Origin on Solana...
                </p>
                <div className="space-y-2 text-xs text-slate-500 font-mono">
                  {faceHash && <div>Face Hash: {faceHash.substring(0, 16)}...</div>}
                  {imageHash && <div>Image Hash: {imageHash.substring(0, 16)}...</div>}
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <CheckCircle className="text-emerald-400" size={48} />
                </div>
                <p className="text-sm text-center text-white font-medium">
                  Image Shielded Successfully
                </p>
                {txHash && (
                  <div className="p-3 bg-white/5 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Transaction Hash</div>
                    <div className="text-xs text-white font-mono break-all">{txHash}</div>
                  </div>
                )}
              </div>
            )}

            {step === 'error' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <AlertCircle className="text-red-400" size={48} />
                </div>
                <p className="text-sm text-center text-red-400">
                  {error || 'Failed to register proof'}
                </p>
                <button
                  onClick={() => {
                    setStep('connect');
                    setError(null);
                  }}
                  className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
