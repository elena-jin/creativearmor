import React from 'react';
import { Shield } from 'lucide-react';
import { ViewState } from '../types';
import { ProfileDropdown } from './ProfileDropdown';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewState;
  onReset: () => void;
  onNavigate?: (view: ViewState) => void;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, view, onReset, onNavigate, onLogout }) => {
  const isLanding = view === 'landing';
  const isLogin = view === 'login';
  const hideHeader = isLanding || isLogin;

  const handleNavigation = (newView: ViewState) => {
    if (onNavigate) {
      onNavigate(newView);
    }
  };

  return (
    <div className="min-h-screen relative text-slate-200 selection:bg-indigo-500/30">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-[-1] bg-obsidian">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-indigo-900/20 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-[100px]" />
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Header */}
      {!hideHeader && (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
            <div className="relative">
              <Shield className="text-white fill-white/10" size={28} />
              <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white leading-none">CreativeArmor</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Active Identity Defense</p>
            </div>
          </div>
          
          {(view === 'dashboard' || view === 'moderation') && (
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-light">
              <button
                onClick={() => handleNavigation('moderation')}
                className={`hover:text-white transition-colors cursor-pointer ${
                  view === 'moderation' ? 'text-white' : ''
                }`}
              >
                Moderation
              </button>
              <button
                onClick={() => handleNavigation('ledger')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Ledger
              </button>
              <button
                onClick={() => handleNavigation('protection')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Protection
              </button>
              <button
                onClick={() => handleNavigation('settings')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Settings
              </button>
              {onNavigate && onLogout && (
                <ProfileDropdown onNavigate={handleNavigation} onLogout={onLogout} />
              )}
            </div>
          )}
        </header>
      )}

      <main className={`${hideHeader ? '' : 'pt-28'} px-4 md:px-6 relative z-10`}>
        {children}
      </main>
    </div>
  );
};
