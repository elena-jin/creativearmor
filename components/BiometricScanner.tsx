import React, { useState, useEffect, useCallback, useRef } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, ShieldCheck, Lock, Fingerprint } from 'lucide-react';
import { SCAN_LOGS } from '../constants';

interface BiometricScannerProps {
  onComplete: () => void;
}

export const BiometricScanner: React.FC<BiometricScannerProps> = ({ onComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);

  const startScan = useCallback(() => {
    setScanning(true);
    let currentLog = 0;
    
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    // Logs simulation
    const logInterval = setInterval(() => {
      if (currentLog < SCAN_LOGS.length) {
        setLogs(prev => [...prev, SCAN_LOGS[currentLog]]);
        currentLog++;
      } else {
        clearInterval(logInterval);
      }
    }, 450);

    // Completion
    setTimeout(() => {
      onComplete();
    }, 3500);
  }, [onComplete]);

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[500px] rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl shadow-indigo-500/10">
      
      {/* Background/Webcam Layer */}
      <div className="absolute inset-0 z-0">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover opacity-80 mix-blend-screen"
          mirrored
        />
        {/* Dark overlay for cinematic look */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian opacity-60"></div>
      </div>

      {/* UI Overlay Layer */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6">
        
        {/* Central Reticle */}
        <div className="relative w-64 h-64 border border-white/20 rounded-full flex items-center justify-center">
          {/* Animated Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border border-t-indigo-500 border-r-transparent border-b-indigo-500 border-l-transparent rounded-full opacity-70"
          />
          
          {/* Inner Marks */}
          <div className="absolute inset-2 border border-dashed border-white/10 rounded-full"></div>

          {/* Face Bounding Box (Corners) */}
          <div className="absolute w-48 h-48">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-indigo-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-indigo-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-indigo-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-indigo-400 rounded-br-lg"></div>
          </div>

          {!scanning && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-white/80"
            >
              <Scan size={48} strokeWidth={1} />
            </motion.div>
          )}

          {scanning && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-emerald-400"
            >
              <Fingerprint size={64} strokeWidth={1} className="animate-pulse" />
            </motion.div>
          )}
        </div>

        {/* Scan Line Animation */}
        {scanning && (
          <motion.div
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-full h-1 scan-line top-0 z-20"
          />
        )}

        {/* Controls & Status */}
        <div className="absolute bottom-8 w-full px-8 flex flex-col items-center gap-4">
          
          {!scanning ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startScan}
              className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-8 py-3 rounded-full flex items-center gap-3 transition-all group"
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:animate-pulse"></div>
              <span className="font-light tracking-wide">INITIALIZE IDENTITY SCAN</span>
            </motion.button>
          ) : (
             <div className="w-full max-w-md">
                <div className="flex justify-between text-xs font-mono text-indigo-300 mb-2">
                  <span>ANALYZING BIOMETRICS</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-4 h-24 overflow-hidden mask-fade-bottom">
                  <div className="flex flex-col-reverse">
                    {logs.map((log, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[10px] font-mono text-white/50 py-0.5"
                      >
                        {`> ${log}`}
                      </motion.div>
                    ))}
                  </div>
                </div>
             </div>
          )}
        </div>
      </div>
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
    </div>
  );
};