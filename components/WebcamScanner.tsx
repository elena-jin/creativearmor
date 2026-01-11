import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Camera } from 'lucide-react';

interface WebcamScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (isAI: boolean, imageData?: string) => void;
}

export const WebcamScanner: React.FC<WebcamScannerProps> = ({ isOpen, onClose, onScanComplete }) => {
  const webcamRef = useRef<Webcam>(null);
  const [scanning, setScanning] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [facePosition, setFacePosition] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [verificationResult, setVerificationResult] = useState<'pending' | 'passed' | 'ai-detected' | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const scanCountRef = useRef(0); // Track the number of scans

  useEffect(() => {
    if (isOpen && !scanning) {
      // Simulate face detection with moving bounding box
      const interval = setInterval(() => {
        setFaceDetected(true);
        setFacePosition(prev => ({
          x: prev.x + (Math.random() - 0.5) * 10,
          y: prev.y + (Math.random() - 0.5) * 10,
          width: 180 + Math.random() * 40,
          height: 180 + Math.random() * 40,
        }));
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isOpen, scanning]);

  const handleScan = async () => {
    setScanning(true);
    setVerificationResult('pending');

    // Simulate AI detection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock deterministic AI results: first scan is real, second & third are AI
    const scanNumber = scanCountRef.current;
    let isAI = false;
    if (scanNumber === 1 || scanNumber === 2) isAI = true;

    setVerificationResult(isAI ? 'ai-detected' : 'passed');

    // Capture image if available
    let imageData: string | undefined;
    if (webcamRef.current) {
      imageData = webcamRef.current.getScreenshot() || undefined;
    }

    // Increment scan counter
    scanCountRef.current += 1;

    // Wait a bit before calling onComplete
    setTimeout(() => {
      onScanComplete(isAI, imageData);
      setScanning(false);
      setVerificationResult(null);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Camera className="text-indigo-400" size={24} />
            <h2 className="text-2xl font-light text-white">AI Verification Scan</h2>
          </div>

          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {cameraError ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <AlertTriangle className="text-red-400 mx-auto mb-2" size={32} />
                  <p className="text-red-400 text-sm">{cameraError}</p>
                </div>
              </div>
            ) : (
              <>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  screenshotQuality={0.92}
                  className="w-full h-full object-cover"
                  mirrored
                  videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
                  onUserMedia={() => setCameraError(null)}
                  onUserMediaError={() => setCameraError('Camera access denied')}
                />

                {/* Moving bounding box */}
                <AnimatePresence>
                  {faceDetected && (
                    <motion.div
                      key="face-box"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        x: facePosition.x,
                        y: facePosition.y,
                        width: facePosition.width,
                        height: facePosition.height,
                      }}
                      transition={{ type: "spring", stiffness: 100, damping: 15 }}
                      className="absolute border-2 border-emerald-400 rounded-lg pointer-events-none"
                      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-mono text-emerald-400 whitespace-nowrap"
                      >
                        FACE DETECTED
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Verification result overlay */}
                <AnimatePresence>
                  {verificationResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    >
                      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center">
                        {verificationResult === 'passed' && (
                          <>
                            <CheckCircle className="text-emerald-400 mx-auto mb-4" size={64} />
                            <h3 className="text-2xl font-light text-white mb-2">Verification Hash Passed</h3>
                            <p className="text-slate-400">Non-AI verification confirmed</p>
                          </>
                        )}
                        {verificationResult === 'ai-detected' && (
                          <>
                            <AlertTriangle className="text-red-400 mx-auto mb-4" size={64} />
                            <h3 className="text-2xl font-light text-white mb-2">Alert: AI Detected</h3>
                            <p className="text-slate-400">AI-generated content identified</p>
                          </>
                        )}
                        {verificationResult === 'pending' && (
                          <>
                            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <h3 className="text-xl font-light text-white mb-2">Analyzing...</h3>
                            <p className="text-slate-400">Running AI detection</p>
                          </>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleScan}
              disabled={scanning || !faceDetected || !!cameraError}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {scanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Scanning...
                </>
              ) : (
                <>
                  <Camera size={18} />
                  Scan for AI
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
