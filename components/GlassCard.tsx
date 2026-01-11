import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  hoverEffect?: boolean;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  delay = 0,
  hoverEffect = false,
  onClick 
}) => {
  const baseClasses = "p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl";
  const combinedClasses = `${baseClasses} ${className}`;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={combinedClasses}
      whileHover={hoverEffect ? { scale: 1.02, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : undefined}
    >
      {children}
    </motion.div>
  );

  return cardContent;
};
