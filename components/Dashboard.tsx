import React, { useEffect, useState } from 'react';
import { GlassCard } from './GlassCard';
import { IdentityRecord, Alert } from '../types';
import { ShieldCheck, Mic, Activity, AlertTriangle, ChevronRight, Fingerprint, Lock, BarChart3, TrendingUp, Shield } from 'lucide-react';
import { RECENT_ALERTS } from '../constants';
import { getAnalyticsMetrics } from '../services/snowflakeService';
import { getScanHistory } from '../services/solanaService';
import { ScanEvent } from '../types';
import { getCurrentWallet, WalletConnection } from '../solana/connectWallet';
import { ShieldImageModal } from './ShieldImageModal';

interface DashboardProps {
  identity: IdentityRecord;
  onAlertClick: (alert: Alert) => void;
  onNewAlert?: (alert: Alert) => void;
  recentAlerts?: Alert[];
}

export const Dashboard: React.FC<DashboardProps> = ({ identity, onAlertClick, onNewAlert, recentAlerts: propsRecentAlerts }) => {
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

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [metrics, history, currentWallet] = await Promise.all([
        getAnalyticsMetrics(),
        getScanHistory(5),
        getCurrentWallet()
      ]);
      setAnalytics(metrics);
      setScanHistory(history);
      setWallet(currentWallet);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleShieldImage = () => {
    // Create file input
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
  };

  const handleShieldComplete = (txHash: string, imageFile?: File) => {
    setLastShieldedTx(txHash);
    setShowShieldModal(false);
    // Reload wallet connection
    getCurrentWallet().then(setWallet);
    
    // Create alert for unverified image
    if (imageFile) {
      const imageUrl = URL.createObjectURL(imageFile);
      const newAlert: Alert = {
        id: `AL-${Date.now()}`,
        platform: 'TikTok' as const,
        thumbnailUrl: imageUrl,
        detectedAt: 'Just now',
        confidence: 0, // Unverified
        status: 'active',
      };
      
      // Add to recent alerts (at the beginning)
      setRecentAlerts(prev => [newAlert, ...prev]);
      
      // Notify parent component
      onNewAlert?.(newAlert);
    }
  };
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

      {/* 2. Solana Proof Layer */}
      <GlassCard className="col-span-1" delay={0.2}>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-light text-white">Human Origin Registry</h3>
            <Shield size={18} className="text-purple-400" />
        </div>
        
        {wallet?.connected ? (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Wallet Address</div>
              <div className="font-mono text-xs text-white truncate">
                {wallet.publicKey?.toString().substring(0, 8)}...{wallet.publicKey?.toString().slice(-6)}
              </div>
            </div>
            
            {lastShieldedTx && (
              <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                <div className="text-xs text-slate-400 mb-1">Last Shielded</div>
                <div className="font-mono text-xs text-white truncate">
                  {lastShieldedTx.substring(0, 12)}...
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            )}
            
            <button
              onClick={handleShieldImage}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              Shield Image on Solana
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-white/5 border border-white/5 text-center">
              <div className="text-xs text-slate-400 mb-2">Connect wallet to register images</div>
              <div className="text-xs text-slate-500">Proof of Human Origin</div>
            </div>
            <button
              onClick={handleShieldImage}
              className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-semibold rounded-lg hover:from-purple-500 hover:to-purple-400 transition-all flex items-center justify-center gap-2"
            >
              <Shield size={16} />
              Shield Image on Solana
            </button>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-white/5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Solana Proof Layer</div>
          <div className="text-xs text-slate-400">Decentralized Identity Timestamping</div>
        </div>
      </GlassCard>

      {/* 3. Recent Alerts (Actionable) */}
      <GlassCard className="col-span-1 md:col-span-2" delay={0.3}>
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-light text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                Recent Alerts
            </h3>
            <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/20">1 Action Required</span>
        </div>

        <div className="space-y-3">
            {recentAlerts.map((alert) => (
                <div 
                    key={alert.id}
                    onClick={() => alert.status === 'active' && onAlertClick(alert)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group ${
                        alert.status === 'active' 
                        ? alert.confidence === 0
                          ? 'bg-amber-950/20 border-amber-500/20 hover:bg-amber-900/20'
                          : 'bg-red-950/20 border-red-500/20 hover:bg-red-900/20'
                        : 'bg-white/5 border-white/5 opacity-60'
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded overflow-hidden relative">
                             <img src={alert.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                             {alert.status === 'active' && (
                               <div className={`absolute inset-0 ${alert.confidence === 0 ? 'bg-amber-500/20' : 'bg-red-500/20'}`}></div>
                             )}
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
                                : `Detected ${alert.detectedAt} • ${alert.confidence}% Confidence`}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {alert.status === 'active' ? (
                             <span className={`text-xs font-semibold ${alert.confidence === 0 ? 'text-amber-400 group-hover:text-amber-300' : 'text-red-400 group-hover:text-red-300'}`}>
                               {alert.confidence === 0 ? 'UNVERIFIED' : 'ACTIVATE DEFENSE'}
                             </span>
                        ) : (
                             <span className="text-xs text-slate-500">RESOLVED</span>
                        )}
                        <ChevronRight size={16} className={`text-slate-600 ${alert.status === 'active' ? 'group-hover:text-red-400 group-hover:translate-x-1 transition-transform' : ''}`} />
                    </div>
                </div>
            ))}
        </div>
      </GlassCard>

      {/* 4. Analytics (Snowflake) */}
      <GlassCard className="col-span-1 md:col-span-2" delay={0.4}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-light text-white flex items-center gap-2">
            <BarChart3 size={18} className="text-blue-400" />
            Analytics
          </h3>
          <div className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/20">
            Analytics
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : analytics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Total Scans</div>
              <div className="text-2xl font-light text-white">{analytics.totalScans}</div>
              <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +12% this month
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">AI Matches</div>
              <div className="text-2xl font-light text-white">{analytics.aiGeneratedMatches}</div>
              <div className="text-xs text-red-400 mt-1">
                {((analytics.aiGeneratedMatches / analytics.totalScans) * 100).toFixed(1)}% rate
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Top Category</div>
              <div className="text-2xl font-light text-white">{analytics.mostCommonCategory}</div>
              <div className="text-xs text-slate-500 mt-1">Most detected</div>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/5">
              <div className="text-xs text-slate-400 mb-1">Avg Confidence</div>
              <div className="text-2xl font-light text-white">{analytics.averageConfidence.toFixed(1)}%</div>
              <div className="text-xs text-slate-500 mt-1">Detection accuracy</div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* 5. Scan History (Solana) */}
      <GlassCard className="col-span-1" delay={0.5}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-light text-white">Scan History</h3>
          <div className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/20">
            Solana
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.slice(0, 5).map((event) => (
              <div key={event.scanId} className="flex items-center gap-3 text-xs">
                <div className={`w-2 h-2 rounded-full ${event.detectedIncident ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                <div className="flex-1">
                  <div className="text-slate-300">{event.scanId}</div>
                  <div className="text-slate-600 font-mono">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                </div>
                <div className="text-slate-500">
                  {event.confidenceScore.toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Powered by</div>
          <div className="text-sm font-semibold text-slate-300">SOLANA</div>
        </div>
      </GlassCard>

      <ShieldImageModal
        isOpen={showShieldModal}
        onClose={() => {
          setShowShieldModal(false);
          setSelectedImage(null);
        }}
        onComplete={(txHash) => handleShieldComplete(txHash, selectedImage || undefined)}
        imageFile={selectedImage || undefined}
      />
    </div>
  );
};