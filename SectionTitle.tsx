import React from 'react';
import { motion } from 'motion/react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  variant?: 'light' | 'dark';
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  align = 'center',
  variant = 'light',
}) => {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  const isDark = variant === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 ${alignClass} space-y-2`}
    >
      {subtitle && (
        <span className={`text-xs tracking-widest font-sans font-medium uppercase ${isDark ? 'text-[#c9a96e]' : 'text-neutral-400'}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-2xl md:text-3.5xl font-sans font-normal tracking-tight leading-tight ${isDark ? 'text-white' : 'text-neutral-900'}`}>
        {title}
      </h2>
      <div className={`h-[1px] w-12 mt-4 ${isDark ? 'bg-white/20' : 'bg-neutral-950'} ${align === 'center' ? 'mx-auto' : 'ml-0'}`}></div>
    </motion.div>
  );
};
