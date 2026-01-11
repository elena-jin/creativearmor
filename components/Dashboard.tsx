import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { IdentityRecord, Alert, ScanEvent } from '../types';
import { ShieldCheck, Activity, AlertTriangle, ChevronRight, Fingerprint, Lock, Shield, Cloud, Image as ImageIcon, ExternalLink, ShieldAlert } from 'lucide-react';
import { RECENT_ALERTS } from '../constants';
import { getAnalyticsMetrics } from '../services/snowflakeService';
import { getScanHistory } from '../services/solanaService';
import { getCurrentWallet, WalletConnection } from '../solana/connectWallet';
import { ShieldImageModal } from './ShieldImageModal';
import { getDeepfakeAlerts } from '../services/googleDeepfakeService';

interface DashboardProps {
  identity: IdentityRecord;
  onAlertClick: (alert: Alert) => void;
  recentAlerts?: Alert[];
  setRecentAlerts?: (alerts: Alert[] | ((prev: Alert[]) => Alert[])) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  identity, 
  onAlertClick, 
  recentAlerts: propsRecentAlerts,
  setRecentAlerts: setPropsRecentAlerts 
}) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<ScanEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletConnection | null>(null);
  const [showShieldModal, setShowShieldModal] = useState(false);
  const [lastShieldedTx, setLastShieldedTx] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>(propsRecentAlerts || RECENT_ALERTS);
  
  // Update local state when props change
  useEffect(() => {
    if (propsRecentAlerts) {
      setRecentAlerts(propsRecentAlerts);
    }
  }, [propsRecentAlerts]);

  const getTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'min' : 'mins'} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    const days = Math.floor(hours / 24);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [metrics, history, currentWallet, googleAlerts] = await Promise.all([
        getAnalyticsMetrics(),
        getScanHistory(5),
        getCurrentWallet(),
        getDeepfakeAlerts()
      ]);
      setAnalytics(metrics);
      setScanHistory(history);
      setWallet(currentWallet);
      
      // Convert Google alerts to Alert format and merge with existing alerts
      const convertedAlerts: Alert[] = googleAlerts.map((detection, idx) => ({
        id: `GOOGLE-${Date.now()}-${idx}`,
        platform: detection.platform as any,
        source: 'Google Deepfake Detection',
        detectedLocation: detection.detectedLocation,
        thumbnailUrl: detection.imageUrl,
        detectedAt: getTimeAgo(new Date(detection.timestamp)),
        confidence: detection.confidence,
        status: 'active' as const,
      }));
      
      // Merge with existing alerts, avoiding duplicates
      setRecentAlerts(prev => {
        const existingIds = new Set(prev.map(a => a.id));
        const newAlerts = convertedAlerts.filter(a => !existingIds.has(a.id));
        if (newAlerts.length > 0) {
          const updated = [...newAlerts, ...prev];
          if (setPropsRecentAlerts) {
            setPropsRecentAlerts(updated);
          }
          return updated;
        }
        return prev;
      });
      
      setLoading(false);
    };
    loadData();
    
    // Poll for new alerts every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [setPropsRecentAlerts]);

  const handleShieldImage = (fromLibrary: boolean = false) => {
    if (fromLibrary) {
      // For iCloud/Photo Library integration
      // In production, this would use the File System Access API or similar
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.setAttribute('webkitdirectory', 'false');
      input.multiple = false;
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setSelectedImage(file);
          setShowShieldModal(true);
        }
      };
      input.click();
    } else {
      // Regular file upload
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setSelectedImage(file);
          setShowShieldModal(true);
        }
      };
      input.click();
    }
  };

  const handleShieldComplete = (txHash: string, imageFile?: File) => {
    setLastShieldedTx(txHash);
    setShowShieldModal(false);
    
    // Create a preview URL for the image
    let imageUrl = '';
    if (imageFile) {
      imageUrl = URL.createObjectURL(imageFile);
    }
    
    // Add new unverified alert to recent alerts
    const newAlert: Alert = {
      id: `AL-${Date.now()}`,
      platform: 'Upload' as any,
      source: 'Upload',
      thumbnailUrl: imageUrl || 'https://via.placeholder.com/200/300?text=Uploaded+Image',
      detectedAt: 'Just now',
      confidence: 0, // 0 means unverified
      status: 'active',
    };
    
    const updatedAlerts = [newAlert, ...recentAlerts];
    setRecentAlerts(updatedAlerts);
    
    // Also update parent if setter provided
    if (setPropsRecentAlerts) {
      setPropsRecentAlerts(updatedAlerts);
    }
  };

  const walletAddress = wallet?.publicKey || 'Not connected';
  const walletConnected = wallet?.connected || false;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto pb-12">
      
      {/* 1. Identity Overview (Large Card) */}
      <GlassCard className="col-span-1 md:col-span-2 min-h-[240px] flex flex-col justify-between" delay={0.1}>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <span className="text-2xl font-light">E</span>
            </div>
            <div>
              <h2 className="text-2xl font-light text-white">{identity.name}</h2>
              <div className="flex items-center gap-2 text-emerald-400 text-sm mt-1">
                <ShieldCheck size={14} />
                <span>Biometrics Authenticated</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400 uppercase tracking-widest font-mono mb-1">Trust Score</div>
            <div className="text-3xl font-light text-white">{identity.trustScore}/100</div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-3 gap-4">
             <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Did Registry</div>
                <div className="font-mono text-xs text-white truncate opacity-70">{identity.id}</div>
             </div>
             <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Last Verified</div>
                <div className="text-xs text-white opacity-70">Just now</div>
             </div>
             <div className="p-3 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                <Lock size={12} className="text-emerald-400" />
                <div className="text-xs text-white opacity-70">Defense Active</div>
             </div>
        </div>
      </GlassCard>

      {/* 2. Analytics Card (Snowflake) */}
      <GlassCard className="col-span-1" delay={0.2}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-light text-white">Analytics</h3>
            <Activity size={18} className="text-indigo-400" />
        </div>
        {loading ? (
          <div className="text-sm text-slate-400">Loading...</div>
        ) : analytics ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-slate-400 mb-1">Total Scans</div>
              <div className="text-2xl font-light text-white">{analytics.totalScans.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">AI Matches</div>
              <div className="text-2xl font-light text-white">{analytics.aiGeneratedMatches}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Most Common</div>
              <div className="text-sm text-white">{analytics.mostCommonCategory}</div>
            </div>
          </div>
        ) : null}
      </GlassCard>

      {/* 3. Recent Alerts (Actionable) */}
      <GlassCard className="col-span-1 md:col-span-2" delay={0.3}>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-light text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                Recent Alerts
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/20">
              {recentAlerts.filter(a => a.status === 'active').length} Action Required
            </span>
        </div>

        <div className="space-y-3">
            {recentAlerts.map((alert) => (
                <div 
                    key={alert.id}
                    onClick={() => alert.status === 'active' && onAlertClick(alert)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                        alert.confidence === 0 // Unverified image styling
                        ? 'bg-amber-950/20 border-amber-500/20 hover:bg-amber-900/20'
                        : alert.status === 'active' 
                        ? 'bg-red-950/20 border-red-500/20 hover:bg-red-900/20' 
                        : 'bg-white/5 border-white/5 opacity-60'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded overflow-hidden relative">
                             <img src={alert.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                             {alert.status === 'active' && <div className="absolute inset-0 bg-red-500/20"></div>}
                        </div>
                        <div>
                            <div className="text-sm text-white font-medium flex items-center gap-2">
                                {alert.confidence === 0 ? 'Unverified Image' : `${alert.platform} Deepfake`}
                                {alert.status === 'active' && (
                                  <span className={`w-2 h-2 rounded-full ${alert.confidence === 0 ? 'bg-amber-500' : 'bg-red-500'} animate-pulse`}></span>
                                )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {alert.confidence === 0 
                                ? `Uploaded ${alert.detectedAt} • Unverified`
                                : `${alert.source} • ${alert.detectedAt} • ${alert.confidence}% Confidence`}
                            </div>
                            {alert.detectedLocation && (
                              <a 
                                href={alert.detectedLocation} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 mt-1"
                              >
                                <ExternalLink size={10} />
                                View location
                              </a>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {alert.confidence === 0 ? (
                             <span className="text-xs font-semibold text-amber-400 group-hover:text-amber-300">UNVERIFIED</span>
                        ) : alert.status === 'active' ? (
                             <span className="text-xs font-semibold text-red-400 group-hover:text-red-300">ACTIVATE DEFENSE</span>
                        ) : (
                             <span className="text-xs text-slate-500">RESOLVED</span>
                        )}
                        <ChevronRight size={16} className={`text-slate-600 ${alert.status === 'active' ? 'group-hover:text-red-400 group-hover:translate-x-1 transition-transform' : ''}`} />
                    </div>
                </div>
            ))}
        </div>
      </GlassCard>

      {/* 4. Human Origin Registry (Solana) */}
      <GlassCard className="col-span-1" delay={0.4}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-light text-white">Human Origin Registry</h3>
          <Fingerprint size={18} className="text-purple-400" />
        </div>
        {walletConnected ? (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">Wallet: <span className="font-mono text-white truncate">{walletAddress}</span></div>
            <div className="text-xs text-slate-400">Last Shielded: <span className="font-mono text-white">{lastShieldedTx ? `${lastShieldedTx.substring(0, 6)}...${lastShieldedTx.substring(lastShieldedTx.length - 6)}` : 'N/A'}</span></div>
            <div className="space-y-2 mt-4">
              <button
                onClick={() => handleShieldImage(false)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Shield size={16} /> Shield Image on Solana
              </button>
              <button
                onClick={() => handleShieldImage(true)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Cloud size={16} /> Sync from iCloud/Photos
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-slate-400 mb-4">Connect wallet to register images</p>
            <div className="space-y-2">
              <button
                onClick={() => handleShieldImage(false)}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Shield size={16} /> Shield Image on Solana
              </button>
              <button
                onClick={() => handleShieldImage(true)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Cloud size={16} /> Sync from iCloud/Photos
              </button>
            </div>
          </div>
        )}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Solana Proof Layer</div>
          <div className="text-sm font-semibold text-slate-300">Decentralized Identity Timestamping</div>
        </div>
      </GlassCard>

      {/* Shield Image Modal */}
      <ShieldImageModal
        isOpen={showShieldModal}
        onClose={() => {
          setShowShieldModal(false);
          setSelectedImage(null);
        }}
        onComplete={handleShieldComplete}
        imageFile={selectedImage || undefined}
      />
    </div>
  );
};
