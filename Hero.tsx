import React from 'react';
import { motion, useScroll, useTransform, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Hero: React.FC = () => {
  // Use scroll position for true physical parallax depth & background image zoom
  const { scrollY } = useScroll();
  const bgTranslateY = useTransform(scrollY, [0, 900], [0, 200]);
  const bgScale = useTransform(scrollY, [0, 900], [1.02, 1.15]);

  // Master stagger container configuration
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.16,
        delayChildren: 0.25,
      },
    },
  };

  // Luxury crop masked text rise transition
  const maskLineVariants: Variants = {
    hidden: { y: "115%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 42, 
        damping: 14,
        duration: 1.1 
      },
    },
  };

  // Slide-fade animation for secondary content layers
  const secondaryVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: 'spring', 
        stiffness: 45, 
        damping: 15,
        duration: 0.85 
      },
    },
  };

  return (
    <div className="relative w-full h-screen min-h-[700px] flex items-end bg-[#0a0a0a] overflow-hidden">
      
      {/* FLOATING DECORATIVE BACKGROUND ELEMENTS */}
      
      {/* 1. Large rotating fine golden wireframe outline circle */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        className="absolute -right-32 bottom-1/4 w-[500px] h-[500px] rounded-full border border-[#c9a96e]/10 pointer-events-none z-10 hidden lg:block"
      />

      {/* 2. Medium inner rotating concentric ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -right-20 bottom-[30%] w-[350px] h-[350px] rounded-full border border-dashed border-[#c9a96e]/5 pointer-events-none z-10 hidden lg:block"
      />

      {/* 3. Floating Sparkle Stars (Ambient, slow drifting) */}
      <motion.div 
        animate={{ 
          y: [0, -18, 0],
          x: [0, 5, 0],
          opacity: [0.25, 0.65, 0.25] 
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[12%] top-[25%] text-[#c9a96e] text-lg font-serif pointer-events-none z-10 select-none hidden md:block"
      >
        ✦
      </motion.div>

      <motion.div 
        animate={{ 
          y: [0, 20, 0],
          x: [0, -6, 0],
          opacity: [0.15, 0.45, 0.15] 
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute right-[22%] top-[16%] text-white text-sm font-serif pointer-events-none z-10 select-none hidden md:block"
      >
        ✦
      </motion.div>

      <motion.div 
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2.5 }}
        className="absolute left-[40%] bottom-[12%] text-[#c9a96e]/60 text-xs font-serif pointer-events-none z-10 select-none hidden md:block"
      >
        ★
      </motion.div>

      {/* BACKGROUND IMAGE LAYER WITH SCROLL-PARALLAX & DEEP GRADIENT OVERLAY */}
      <motion.div 
        style={{ y: bgTranslateY, scale: bgScale }}
        className="absolute inset-0 w-full h-full z-0"
      >
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&auto=format&fit=crop&q=90"
          alt="Cinematic luxury fashion banner"
          className="absolute inset-0 w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Cinematic rich overlays to retain solid typography legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/55 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/75 via-transparent to-transparent" />
      </motion.div>

      {/* TOP-RIGHT CORNER VINTAGE BADGE (Entering with premium scale) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.95, type: 'spring' }}
        className="absolute top-10 right-10 z-20 hidden md:block"
      >
        <div className="w-26 h-26 rounded-full border border-white/20 flex flex-col items-center justify-center text-white text-center select-none backdrop-blur-md bg-black/10 shadow-lg group hover:border-[#c9a96e]/65 transition-colors duration-500">
          <span className="text-[9px] tracking-[0.25em] font-light uppercase text-white/50">ESTD</span>
          <span className="text-xl font-serif font-light mt-0.5 leading-none tracking-wider text-white group-hover:text-[#c9a96e] transition-colors">2024</span>
          <span className="text-[7.5px] tracking-[0.3em] text-[#c9a96e] font-bold uppercase mt-0.5">SAIGON</span>
        </div>
      </motion.div>

      {/* MAIN CONTENT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-16 lg:pb-24 w-full relative z-20"
      >
        {/* EYEBROW TEXT */}
        <div className="overflow-hidden mb-3">
          <motion.div 
            variants={maskLineVariants} 
            className="flex items-center gap-3 select-none"
          >
            <div className="w-10 h-[1.5px] bg-[#c9a96e]" />
            <span className="text-[#c9a96e] text-[11px] tracking-[0.32em] uppercase font-sans font-extrabold">
              The Aura Collection — Spring 2026
            </span>
          </motion.div>
        </div>

        {/* HEADLINE — Staggered and masked for professional text reveal */}
        <h1 className="font-serif text-[clamp(2.7rem,7.5vw,6.5rem)] font-extralight text-white leading-[1.05] tracking-tight select-none mb-6">
          <div className="overflow-hidden block py-1">
            <motion.span variants={maskLineVariants} className="block">
              Định Nghĩa
            </motion.span>
          </div>
          <div className="overflow-hidden block py-1">
            <motion.span variants={maskLineVariants} className="font-medium italic text-[#c9a96e] block">
              Phong Cách
            </motion.span>
          </div>
          <div className="overflow-hidden block py-1">
            <motion.span variants={maskLineVariants} className="block">
              Của Bạn
            </motion.span>
          </div>
        </h1>

        {/* DESCRIPTION + STATS ROW (Revealed with slide fade animation) */}
        <motion.div 
          variants={secondaryVariants}
          className="flex flex-col md:flex-row items-start md:items-end gap-10 pt-4 mb-9 border-t border-white/5 pb-2"
        >
          <p className="text-white/60 text-xs sm:text-sm leading-relaxed max-w-xs font-sans font-light">
            Thời trang không chỉ là trang phục khoác lên người. Đó là ngôn ngữ nghệ thuật nâng niu vóc dáng, giúp bạn khẳng định câu chuyện cá nhân đĩnh đạc nhất.
          </p>

          <div className="flex gap-8 select-none border-t border-white/10 md:border-t-0 pt-4 md:pt-0 w-full md:w-auto">
            {/* Stat 1 */}
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-serif text-white font-medium leading-none">12K+</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest font-sans font-bold">Khách hàng</div>
            </div>
            {/* Stat 2 */}
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-serif text-white font-medium leading-none">200+</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest font-sans font-bold">Mẫu độc quyền</div>
            </div>
            {/* Stat 3 */}
            <div className="space-y-1">
              <div className="text-xl sm:text-2xl font-serif text-white font-medium leading-none">5★</div>
              <div className="text-[9px] text-white/40 uppercase tracking-widest font-sans font-bold">Atelier Rating</div>
            </div>
          </div>
        </motion.div>

        {/* CTA BUTTONS (Sleek slide-fade transition) */}
        <motion.div 
          variants={secondaryVariants}
          className="flex flex-wrap gap-4 pt-2"
        >
          <Link
            to="/shop"
            className="group relative bg-[#c9a96e] text-black font-sans text-[11px] tracking-[0.2em] font-extrabold uppercase py-4 px-10 hover:bg-[#b8945a] transition-all flex items-center gap-2"
          >
            <span>Khám Phá Ngay</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
          
          <Link
            to="/shop?filter=new"
            className="border border-white/20 text-white font-sans text-[11px] tracking-[0.2em] font-bold uppercase py-4 px-10 hover:border-[#c9a96e] hover:text-[#c9a96e] hover:bg-white/5 transition-all"
          >
            Bộ Sưu Tập Mới
          </Link>
        </motion.div>
      </motion.div>

      {/* BOTTOM SCROLL INDICATOR */}
      <motion.div 
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 select-none pointer-events-none"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/30 text-[9px] tracking-widest uppercase font-mono">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />
        </div>
      </motion.div>

    </div>
  );
};

