import React from 'react';
import { Shield } from 'lucide-react';
import { ViewState } from '../types';
import { ProfileDropdown } from './ProfileDropdown';

interface LayoutProps {
  children: React.ReactNode;
  view: ViewState;
  onReset: () => void;
  onNavigate?: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, view, onReset, onNavigate }) => {
  const isLogin = view === 'login';
  const isLanding = view === 'landing';
  const hideHeader = isLogin || isLanding;
  
  return (
    <div className="min-h-screen relative text-slate-200 selection:bg-indigo-500/30">
      
      {/* Animated Gradient Background with Muted Blue */}
      <div className="fixed inset-0 z-[-1] overflow-hidden" style={{ background: 'oklch(0.2409 0.0201 307.5346)' }}>
        {/* Slow moving blur of colors - muted blue gradient */}
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] animated-gradient rounded-full animated-blob opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[700px] h-[700px] animated-gradient rounded-full animated-blob opacity-35" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-[600px] h-[600px] animated-gradient rounded-full animated-blob opacity-30" style={{ animationDelay: '10s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] animated-gradient rounded-full animated-blob opacity-25" style={{ animationDelay: '15s' }}></div>
        
        {/* Subtle grid lines - only show on non-login/landing views */}
        {!hideHeader && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        )}
      </div>

      {/* Header - hidden on login and landing */}
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
          
          {(view === 'dashboard' || view === 'ledger' || view === 'protection' || view === 'settings') && (
            <div className="hidden md:flex items-center gap-6 text-sm text-slate-400 font-light">
               <button 
                 onClick={() => onNavigate?.('ledger')}
                 className={`hover:text-white transition-colors cursor-pointer ${view === 'ledger' ? 'text-white' : ''}`}
               >
                 Ledger
               </button>
               <button 
                 onClick={() => onNavigate?.('protection')}
                 className={`hover:text-white transition-colors cursor-pointer ${view === 'protection' ? 'text-white' : ''}`}
               >
                 Protection
               </button>
               <button 
                 onClick={() => onNavigate?.('settings')}
                 className={`hover:text-white transition-colors cursor-pointer ${view === 'settings' ? 'text-white' : ''}`}
               >
                 Settings
               </button>
               <ProfileDropdown 
                 onSettings={() => onNavigate?.('settings')}
                 onLogout={() => onNavigate?.('landing')}
               />
            </div>
          )}
        </header>
      )}

      <main className={hideHeader ? "relative z-10" : "pt-28 px-4 md:px-6 relative z-10"}>
        {children}
      </main>
    </div>
  );
};