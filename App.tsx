import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Landing } from './components/Landing';
import { Login } from './components/Login';
import { BiometricScanner } from './components/BiometricScanner';
import { Dashboard } from './components/Dashboard';
import { ActiveDefense } from './components/ActiveDefense';
import { Ledger } from './components/Ledger';
import { Protection } from './components/Protection';
import { Settings } from './components/Settings';
import { ViewState, Alert } from './types';
import { MOCK_IDENTITY, RECENT_ALERTS } from './constants';
import { motion, AnimatePresence } from 'framer-motion';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>(RECENT_ALERTS);

  const handleScanComplete = () => {
    setView('dashboard');
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    // Don't change view state fully, just overlay ActiveDefense
  };

  const handleCloseDefense = () => {
    setSelectedAlert(null);
  };

  const handleNewAlert = (alert: Alert) => {
    setRecentAlerts(prev => [alert, ...prev]);
  };

  const handleSignUp = () => {
    setView('login');
  };

  const handleLogin = () => {
    setView('onboarding');
  };

  const renderContent = () => {
    switch (view) {
      case 'landing':
        return <Landing onSignUp={handleSignUp} onLogin={() => setView('login')} />;

      case 'login':
        return <Login onLogin={handleLogin} />;

      case 'onboarding':
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-6xl font-thin tracking-tighter text-white mb-6">
                Protect your <span className="text-indigo-400 font-normal">humanity</span>.
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                CreativeArmor provides active defense against deepfakes and identity theft using cryptographic biometric verification.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <button 
                onClick={() => setView('scanning')}
                className="group relative px-8 py-4 bg-white text-black text-sm font-semibold tracking-wide rounded-full overflow-hidden transition-all hover:scale-105"
              >
                <span className="relative z-10">AUTHENTICATE IDENTITY</span>
                <div className="absolute inset-0 bg-indigo-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
              </button>
            </motion.div>
          </div>
        );

      case 'scanning':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <BiometricScanner onComplete={handleScanComplete} />
            <p className="mt-8 text-sm text-slate-500 font-mono animate-pulse">Establishing secure connection...</p>
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Dashboard 
              identity={MOCK_IDENTITY} 
              onAlertClick={handleAlertClick}
              onNewAlert={handleNewAlert}
              recentAlerts={recentAlerts}
            />
          </motion.div>
        );

      case 'ledger':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Ledger onBack={() => setView('dashboard')} />
          </motion.div>
        );

      case 'protection':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Protection onBack={() => setView('dashboard')} />
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Settings onBack={() => setView('dashboard')} />
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout view={view} onReset={() => setView('landing')} onNavigate={setView}>
      <AnimatePresence mode="wait">
        {renderContent()}
      </AnimatePresence>

      {/* Active Defense Modal Overlay */}
      <AnimatePresence>
        {selectedAlert && (
          <ActiveDefense 
            alert={selectedAlert} 
            identity={MOCK_IDENTITY} 
            onClose={handleCloseDefense} 
          />
        )}
      </AnimatePresence>
    </Layout>
  );
}