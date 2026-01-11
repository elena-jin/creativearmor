import React, { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileDropdownProps {
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ onNavigate, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-700 border border-white/10 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform cursor-pointer"
      >
        <span className="text-sm font-light">E</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-48 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-slate-300 border-b border-white/5 mb-1">
                <div className="font-medium text-white">Elena</div>
                <div className="text-xs text-slate-500">elena@example.com</div>
              </div>
              
              <button
                onClick={() => {
                  onNavigate('settings');
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/5 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Settings size={16} />
                Settings
              </button>
              
              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
