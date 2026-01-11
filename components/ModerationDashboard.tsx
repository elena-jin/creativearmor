import React, { useState, useEffect } from 'react';
import { GlassCard } from './GlassCard';
import { Alert, VerifiedImage, ModerationFilters } from '../types';
import { AlertTriangle, CheckCircle, Upload, Filter, Send, X, Image as ImageIcon, Clock } from 'lucide-react';
import { WebcamScanner } from './WebcamScanner';
import { generateDMCANotice } from '../services/geminiService';

interface ModerationDashboardProps {
  onBack?: () => void;
}

export const ModerationDashboard: React.FC<ModerationDashboardProps> = ({ onBack }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [verifiedImages, setVerifiedImages] = useState<VerifiedImage[]>([]);
  const [filters, setFilters] = useState<ModerationFilters>({
    nudity: true,
    revealing: true,
    deepfake: true,
  });
  const [showScanner, setShowScanner] = useState(false);
  const [reporting, setReporting] = useState(false);

  // Load initial data
  useEffect(() => {
    // Mock alerts
    const mockAlerts: Alert[] = [
      {
        id: 'MOD-001',
        platform: 'TikTok',
        source: 'Google Deepfake Detection',
        thumbnailUrl: 'https://via.placeholder.com/200/300?text=Deepfake+1',
        detectedAt: '2 mins ago',
        confidence: 94.5,
        status: 'pending',
        reason: 'Deepfake',
      },
      {
        id: 'MOD-002',
        platform: 'Instagram',
        source: 'Upload',
        thumbnailUrl: 'https://via.placeholder.com/200/300?text=Revealing+1',
        detectedAt: '15 mins ago',
        confidence: 87.2,
        status: 'pending',
        reason: 'Revealing',
      },
      {
        id: 'MOD-003',
        platform: 'Reddit',
        source: 'Google Deepfake Detection',
        thumbnailUrl: 'https://via.placeholder.com/200/300?text=Nudity+1',
        detectedAt: '1 hour ago',
        confidence: 91.8,
        status: 'pending',
        reason: 'Nudity',
      },
    ];
    setAlerts(mockAlerts);
  }, []);

  // Filter alerts based on selected filters
  const filteredAlerts = alerts.filter(alert => {
    if (alert.status === 'resolved') return false;
    if (!alert.reason) return false;
    return filters[alert.reason.toLowerCase() as keyof ModerationFilters];
  });

  const handleScanComplete = async (isAI: boolean, imageData?: string) => {
    setShowScanner(false);
    
    if (isAI && imageData) {
      // Create new alert for AI-detected content
      const newAlert: Alert = {
        id: `MOD-${Date.now()}`,
        platform: 'Upload',
        source: 'Upload',
        thumbnailUrl: imageData,
        detectedAt: 'Just now',
        confidence: 95.0,
        status: 'pending',
        reason: 'Deepfake',
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const handleReportAll = async () => {
    if (filteredAlerts.length === 0) return;

    setReporting(true);

    // Process each alert
    for (const alert of filteredAlerts) {
      try {
        // Generate DMCA notice
        await generateDMCANotice(alert.platform, alert.id, 'Elena');
        
        // Simulate agent processing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mark as resolved
        setAlerts(prev =>
          prev.map(a => a.id === alert.id ? { ...a, status: 'resolved' as const } : a)
        );
      } catch (error) {
        console.error(`Error reporting alert ${alert.id}:`, error);
      }
    }

    setReporting(false);
  };

  const handleUploadVerified = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const newVerified: VerifiedImage = {
          id: `VER-${Date.now()}`,
          imageUrl,
          uploadedAt: new Date().toISOString(),
          hash: `hash_${Date.now()}_${Math.random()}`,
        };
        setVerifiedImages(prev => [newVerified, ...prev]);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFilter = (filter: keyof ModerationFilters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <X size={18} />
          Back
        </button>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-light text-white">Moderation Dashboard</h1>
        <button
          onClick={() => setShowScanner(true)}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <ImageIcon size={18} />
          Scan Image
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Alerts */}
        <GlassCard delay={0.1} className="h-[calc(100vh-200px)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="text-amber-400" size={20} />
              <h2 className="text-xl font-light text-white">Alerts</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/20">
                {filteredAlerts.length}
              </span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mb-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Filter size={14} className="text-slate-400" />
              <span className="text-xs text-slate-400 uppercase tracking-wider">Filter Alerts</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(['nudity', 'revealing', 'deepfake'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => toggleFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filters[filter]
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                <p>No active alerts</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={alert.thumbnailUrl}
                      alt="Alert thumbnail"
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{alert.platform}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          alert.reason === 'Nudity' ? 'bg-red-500/20 text-red-300' :
                          alert.reason === 'Revealing' ? 'bg-orange-500/20 text-orange-300' :
                          'bg-purple-500/20 text-purple-300'
                        }`}>
                          {alert.reason}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">{alert.source}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {alert.detectedAt}
                        </div>
                        <div>{alert.confidence}% confidence</div>
                      </div>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      alert.status === 'pending' ? 'bg-amber-500' :
                      alert.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                      'bg-emerald-500'
                    }`}></div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Report All Button */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={handleReportAll}
              disabled={filteredAlerts.length === 0 || reporting}
              className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {reporting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Reporting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Report All ({filteredAlerts.length})
                </>
              )}
            </button>
          </div>
        </GlassCard>

        {/* Right Panel - Verified Images */}
        <GlassCard delay={0.2} className="h-[calc(100vh-200px)] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-emerald-400" size={20} />
              <h2 className="text-xl font-light text-white">Verified Images</h2>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/20">
                {verifiedImages.length}
              </span>
            </div>
            <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg font-medium transition-colors flex items-center gap-2 cursor-pointer">
              <Upload size={16} />
              Upload
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadVerified}
                className="hidden"
              />
            </label>
          </div>

          {/* Verified Images Grid */}
          <div className="flex-1 overflow-y-auto">
            {verifiedImages.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                <p>No verified images</p>
                <p className="text-xs mt-2">Upload images to mark them as safe</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {verifiedImages.map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square rounded-lg overflow-hidden border border-emerald-500/20 bg-white/5 group"
                  >
                    <img
                      src={image.imageUrl}
                      alt="Verified"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <CheckCircle className="text-emerald-400" size={24} />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="text-xs text-white bg-black/50 backdrop-blur-sm px-2 py-1 rounded">
                        Verified
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Webcam Scanner Modal */}
      <WebcamScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onScanComplete={handleScanComplete}
      />
    </div>
  );
};
