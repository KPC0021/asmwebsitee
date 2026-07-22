import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';
import { Product, formatPrice } from '../data/products';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { ShoppingBag, Eye, Star, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  subtitle: string;
  darkMode?: boolean;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, title, subtitle, darkMode = false }) => {
  const { addToCart } = useCartAndAuth();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>(
    products.reduce((acc, p) => ({ ...acc, [p.id]: p.sizes[0] }), {})
  );
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // We want to display responsive number of items
  // Desktop: 4 items, Tablet: 2 items, Mobile: 1 item
  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, products.length - visibleCount);

  // Restart auto-play interval helper
  const startTimer = () => {
    if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    if (!isPlaying) return;

    autoPlayTimerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500); // 4.5 seconds for extremely smooth custom drifting feel
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [isPlaying, maxIndex, visibleCount]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    // Restart timer to delay next slide
    startTimer();
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    startTimer();
  };

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // Progress percentage calculation for bottom visual indicator bar
  const progressPercent = maxIndex > 0 ? (currentIndex / maxIndex) * 100 : 100;

  return (
    <div className={`relative w-full py-16 overflow-hidden border-y ${darkMode ? 'bg-[#0f0f0f] border-white/5' : 'bg-white border-neutral-100'}`}>
      
      {/* Decorative runway background accents */}
      <div className={`absolute top-0 left-0 w-32 h-full bg-gradient-to-r ${darkMode ? 'from-[#0f0f0f]' : 'from-white'} to-transparent z-10 pointer-events-none`} />
      <div className={`absolute top-0 right-0 w-32 h-full bg-gradient-to-l ${darkMode ? 'from-[#0f0f0f]' : 'from-white'} to-transparent z-10 pointer-events-none`} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header containing action buttons and textual styling */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10">
          <div className="text-center md:text-left space-y-2">
            <span className={`text-xs tracking-[0.2em] font-sans font-extrabold uppercase ${darkMode ? 'text-[#c9a96e]' : 'text-[#ce796b]'} block text-center md:text-left`}>
              {subtitle}
            </span>
            <h2 className={`text-2xl md:text-3xl font-sans font-light ${darkMode ? 'text-white' : 'text-neutral-950'} tracking-tight`}>
              {title.split(' ')[0]} <span className="font-semibold">{title.split(' ').slice(1).join(' ')}</span>
            </h2>
          </div>

          {/* Luxury navigational actions */}
          <div className="flex items-center gap-3 mt-6 md:mt-0 z-20">
            {/* Slider Pill Navigators */}
            <div className={`flex items-center gap-1.5 border p-1 rounded-full ${darkMode ? 'border-white/10 bg-white/5' : 'border-neutral-150 bg-neutral-50'}`}>
              <button
                onClick={handlePrev}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs focus:outline-none ${darkMode ? 'text-white bg-[#151515] hover:bg-[#c9a96e] hover:text-black border-none' : 'text-neutral-600 bg-white hover:bg-neutral-950 hover:text-white'}`}
                aria-label="Previous items"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs focus:outline-none ${darkMode ? 'text-white bg-[#151515] hover:bg-[#c9a96e] hover:text-black border-none' : 'text-neutral-600 bg-white hover:bg-neutral-950 hover:text-white'}`}
                aria-label="Next items"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

         {/* Carousel Visual Frame */}
        <div 
          className="relative overflow-visible"
          onMouseEnter={() => {
            setIsPlaying(false);
            if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
          }}
          onMouseLeave={() => {
            setIsPlaying(true);
            startTimer();
          }}
        >
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: `-${(currentIndex * (100 / visibleCount))}%` }}
              transition={
                isPlaying && currentIndex !== 0
                  ? { ease: "linear", duration: 4.5 }
                  : { type: 'spring', stiffness: 55, damping: 14 }
              }
              className="flex whitespace-nowrap"
            >
              {products.map((product) => {
                const currentSize = selectedSizes[product.id] || product.sizes[0];
                const isHovered = hoveredCardId === product.id;

                return (
                  <div
                    key={product.id}
                    className="inline-block px-3 shrink-0"
                    style={{ width: `${100 / visibleCount}%` }}
                    onMouseEnter={() => setHoveredCardId(product.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                  >
                    <div className={`group relative flex flex-col rounded-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border ${darkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-neutral-100'}`}>
                      
                      {/* Ribbon badge alerts */}
                      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                        {product.isNew && (
                          <span className="bg-[#c9a96e] text-black text-[9px] uppercase tracking-wider font-extrabold py-0.5 px-2">
                            New
                          </span>
                        )}
                        {product.isFeatured && !product.isNew && (
                          <span className="bg-white/10 text-white text-[9px] uppercase tracking-wider font-extrabold py-0.5 px-2 backdrop-blur-xs">
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Image Frame */}
                      <div className="relative aspect-[3/4] bg-neutral-900 overflow-hidden">
                        <Link to={`/product/${product.id}`} className="block h-full w-full">
                          <motion.img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            animate={{ scale: isHovered ? 1.05 : 1 }}
                            transition={{ duration: 0.4 }}
                            className="h-full w-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                        </Link>

                        {/* Slide up Selection panel for luxury quick actions */}
                        <motion.div
                          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                          transition={{ duration: 0.2 }}
                          className={`absolute bottom-3 left-3 right-3 hidden md:flex items-center gap-2 p-2 shadow-lg ${darkMode ? 'bg-black/90 backdrop-blur-sm' : 'bg-white/95 backdrop-blur-sm'}`}
                        >
                          <div className="flex-1 flex flex-col">
                            <span className="text-[9px] uppercase tracking-wider font-bold mb-1 pl-1 text-white/40">
                              Quick Size
                            </span>
                            <div className="flex gap-1">
                              {product.sizes.map((sz) => (
                                <button
                                  key={sz}
                                  onClick={() => handleSizeChange(product.id, sz)}
                                  className={`text-[9px] w-6 h-6 rounded-none flex items-center justify-center border transition-all ${
                                    currentSize === sz
                                      ? 'border-[#c9a96e] bg-[#c9a96e] text-black font-semibold'
                                      : 'border-white/10 text-white/60 hover:border-white/30'
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => addToCart(product, currentSize, 1)}
                            className="bg-[#c9a96e] hover:bg-[#b8945a] text-black p-2.5 flex items-center justify-center transition-colors shadow-sm focus:outline-none"
                            title="Add item"
                          >
                            <ShoppingBag size={14} />
                          </button>
                        </motion.div>
                      </div>

                      {/* Text details for items */}
                      <div className={`p-4 flex flex-col flex-grow ${darkMode ? 'bg-[#0a0a0a]' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[9px] uppercase tracking-widest font-extrabold text-white/40">
                            {product.category}
                          </span>
                          <div className="flex items-center text-amber-400 gap-0.5">
                            <Star size={9} className="fill-current" />
                            <span className={`text-[10px] font-bold ${darkMode ? 'text-white/60' : 'text-neutral-600'}`}>{product.rating}</span>
                          </div>
                        </div>

                        <h3 className={`text-xs font-semibold tracking-tight transition-colors mb-2 truncate ${darkMode ? 'text-white hover:text-[#c9a96e]' : 'text-neutral-950 hover:text-neutral-600'}`}>
                          <Link to={`/product/${product.id}`} className="focus:outline-none block">
                            {product.name}
                          </Link>
                        </h3>

                        {/* Mini Sizes inline selection for smaller screens & tablet drag views */}
                        <div className="md:hidden flex gap-1 mb-2">
                          {product.sizes.slice(0, 4).map((sz) => (
                            <span key={sz} className="text-[8px] text-white/40 border border-white/5 px-1 font-mono">
                              {sz}
                            </span>
                          ))}
                        </div>

                        <div className={`mt-auto pt-2 flex items-center justify-between border-t ${darkMode ? 'border-white/5' : 'border-neutral-50'}`}>
                          <span className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-neutral-950'}`}>
                            {formatPrice(product.price)}
                          </span>

                          <div className="flex items-center gap-1.5 md:hidden">
                            <button
                              onClick={() => addToCart(product, currentSize, 1)}
                              className="bg-[#c9a96e] text-black p-1.5 rounded-none hover:bg-[#b8945a]"
                              title="Thêm vào giỏ"
                            >
                              <ShoppingBag size={11} />
                            </button>
                          </div>

                          <Link
                            to={`/product/${product.id}`}
                            className={`hidden md:flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold transition-colors focus:outline-none ${darkMode ? 'text-white/40 hover:text-[#c9a96e]' : 'text-neutral-400 hover:text-neutral-950'}`}
                          >
                            Details <Eye size={12} />
                          </Link>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Minimalist Progress scrollbar indicators at bottom */}
        <div className="mt-10 max-w-xs mx-auto space-y-2">
          <div className={`h-[2px] w-full relative rounded-full overflow-hidden ${darkMode ? 'bg-white/15' : 'bg-neutral-100'}`}>
            <motion.div
              layout
              className={`absolute left-0 top-0 h-full ${darkMode ? 'bg-[#c9a96e]' : 'bg-neutral-950'}`}
              style={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            />
          </div>
          <div className={`flex justify-between items-center text-[10px] font-mono ${darkMode ? 'text-white/35' : 'text-neutral-400'}`}>
            <span>#{String(currentIndex + 1).padStart(2, '0')}</span>
            <span>Total: {products.length} Products</span>
            <span>#{String(maxIndex + 1).padStart(2, '0')}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
