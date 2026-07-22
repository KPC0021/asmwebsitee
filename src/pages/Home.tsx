import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/Hero';
import { ProductCard } from '../components/ProductCard';
import { ProductCarousel } from '../components/ProductCarousel';
import { products, formatPrice } from '../data/products';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles, Flame, Tv, Compass, Crown } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { validateEmail } from '../utils/validation';

interface TpopProject {
  id: string;
  title: string;
  displayTitle: string;
  sub: string;
  icon: string | React.ReactNode;
  image: string;
  description: string;
  link: string;
}

const tpopProjectsInAtelier: TpopProject[] = [
  {
    id: "tp1",
    title: "Stage Glitz",
    displayTitle: "Stage Glitz",
    sub: "01 / Hào Quang Sân Khấu",
    icon: "✦",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1000&auto=format&fit=crop&q=85",
    description: "Nhịp đập rực rỡ của các sân khấu âm nhạc lớn. Thiết kế đính kim sa bắt sáng lộng lẫy và chất lụa satin phản chiếu lấp lánh dưới luồng spotlight của ban nhạc.",
    link: "/shop?filter=featured"
  },
  {
    id: "tp2",
    title: "Y2K Rebel",
    displayTitle: "Y2K Rebel",
    sub: "02 / Nổi Loạn Thập Niên 2000",
    icon: "⚡",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1000&auto=format&fit=crop&q=85",
    description: "Thời trang đường phố đậm cá tính đột phá. Denim bụi bặm phối hợp nhịp nhàng cùng phụ kiện kim loại cá tính tôn vinh tuyên ngôn tự do.",
    link: "/shop?category=women"
  },
  {
    id: "tp3",
    title: "Pastel Dream",
    displayTitle: "Pastel Dream",
    sub: "03 / Giấc Mơ Kẹo Ngọt",
    icon: "🌸",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1000&auto=format&fit=crop&q=85",
    description: "Năng lượng trẻ trung, ngọt ngào đầy mê hoặc. Sắc hồng phấn thướt tha, mint dập ly mịn màng nâng niu thần thái thuần khiết của các thành viên idol.",
    link: "/shop?category=accessories"
  },
  {
    id: "tp4",
    title: "Cyber Punk",
    displayTitle: "Cyber Punk",
    sub: "04 / Khởi Tinh Đô Thị",
    icon: "💿",
    image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=1000&auto=format&fit=crop&q=85",
    description: "Hành trình viễn tưởng đêm đô thị huyền ảo. Áo khoác phản quang cá tính đan xen phom dáng techwear đen tuyền sắc sảo tối tân.",
    link: "/shop?category=men"
  },
  {
    id: "tp5",
    title: "Quiet Luxury",
    displayTitle: "Quiet Luxury",
    sub: "05 / Vương Giả Tối Giản",
    icon: "👑",
    image: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1000&auto=format&fit=crop&q=85",
    description: "Thần thái đĩnh đạc của giới tinh hoa. Những chiếc dạ cừu may đo thủ công, nỉ len cao cấp lụa là đắt giá chuẩn phong cách thượng lưu đài các.",
    link: "/shop?filter=new"
  },
  {
    id: "tp6",
    title: "Neo Tradition",
    displayTitle: "Neo Tradition",
    sub: "06 / Nét Đẹp Tân Thời",
    icon: "🎋",
    image: "https://images.unsplash.com/photo-1534126511673-b6899657816a?w=1000&auto=format&fit=crop&q=85",
    description: "Sự thăng hoa giao duyên rực rỡ văn hóa cổ truyền Á Đông. Áo dài tân thời dệt gấm quý phái kết hợp cùng chunky sneakers cực chất phá cách.",
    link: "/shop?category=shoes"
  }
];

export const Home: React.FC = () => {
  const { showToast } = useCartAndAuth();
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailErr = validateEmail(newsletterEmail);
    if (emailErr) {
      showToast(emailErr, 'error');
      return;
    }

    try {
      const stored = localStorage.getItem('fashion_aura_newsletter');
      const list: string[] = stored ? JSON.parse(stored) : [];
      if (list.includes(newsletterEmail.toLowerCase().trim())) {
        showToast('Email này đã được đăng ký nhận bản tin từ trước!', 'info');
      } else {
        const newList = [...list, newsletterEmail.toLowerCase().trim()];
        localStorage.setItem('fashion_aura_newsletter', JSON.stringify(newList));
        showToast('Cảm ơn bạn đã đăng ký nhận tin từ Fashion Aura!', 'success');
        setNewsletterEmail('');
      }
    } catch (err) {
      console.error(err);
      showToast('Cảm ơn bạn đã đăng ký nhận tin!', 'success');
      setNewsletterEmail('');
    }
  };
  const [selectedCat, setSelectedCat] = useState<'all' | 'women' | 'men' | 'shoes' | 'accessories'>('all');
  const [activeBestSellerIdx, setActiveBestSellerIdx] = useState(0);

  // Filter products for sections
  const baseNewArrivals = products.filter((p) => p.isNew);
  const newArrivals = selectedCat === 'all' 
    ? baseNewArrivals.slice(0, 4) 
    : baseNewArrivals.filter(p => p.category === selectedCat).slice(0, 4);

  const bestSellers = [...products].sort((a, b) => b.rating - a.rating).slice(0, 5);

  const collections = [
    {
      title: 'Women',
      displayTitle: 'Thời Trang Nữ',
      tagline: 'Mềm mại & Bay bổng',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
      category: 'women',
    },
    {
      title: 'Men',
      displayTitle: 'Thời Trang Nam',
      tagline: 'Lịch lãm & Tối giản',
      image: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800&auto=format&fit=crop&q=80',
      category: 'men',
    },
    {
      title: 'Shoes',
      displayTitle: 'Giày Cao Cấp',
      tagline: 'Vững bước & Bền bỉ',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
      category: 'shoes',
    },
    {
      title: 'Accessories',
      displayTitle: 'Phụ Kiện',
      tagline: 'Điểm nhấn khác biệt',
      image: 'https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=800&auto=format&fit=crop&q=80',
      category: 'accessories',
    },
  ];

  // Premium scroll entrance animation primitives
  const scrollFadeInUp: Variants = {
    hidden: { opacity: 0, y: 45 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 45, 
        damping: 14,
        duration: 0.8
      } 
    }
  };

  const scrollScaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        type: 'spring', 
        stiffness: 40,
        damping: 14,
        duration: 0.95
      } 
    }
  };

  // Grid Stagger configurations 
  const containerStagger: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemStagger: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 70, damping: 15 }
    }
  };

  return (
    <div className="bg-[#faf8f5] pb-16 selection:bg-[#c9a96e]/30 overflow-x-hidden">
      
      {/* Hero section with cinematic layouts */}
      <Hero />

      {/* Section 1: Featured Categories Sliding Runway */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 bg-white border-b border-neutral-200/50 relative overflow-hidden"
      >
        {/* Subtle decorative subtle background gold blur light pattern */}
        <div className="absolute top-[10%] left-[-100px] w-72 h-72 rounded-full bg-[#c9a96e]/5 blur-[90px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b border-neutral-100 pb-8 relative z-10">
          <div className="text-center md:text-left space-y-1.5">
            <span className="text-[10px] tracking-[0.3em] font-sans font-bold uppercase text-[#c9a96e] block text-center md:text-left">
              KHÁM PHÁ DÒNG SẢN PHẨM
            </span>
            <h2 className="text-2xl md:text-4xl font-sans font-extralight text-neutral-900 tracking-tight leading-tight">
              Featured <span className="font-serif italic text-[#c9a96e] font-normal">Categories</span>
            </h2>
          </div>
        </div>
        
        {/* Carousel Visual Track with continuous silent drifting runway */}
        <div className="relative overflow-hidden z-10 -mx-4 px-4">
          <div className="flex gap-6 marquee-track hover:[animation-play-state:paused] cursor-grab active:cursor-grabbing pb-4">
            {[...collections, ...collections, ...collections, ...collections].map((coll, idx) => (
              <div
                key={`${coll.category}-${idx}`}
                className="w-[280px] sm:w-[320px] md:w-[350px] shrink-0"
              >
                <div className="group relative h-96 w-full overflow-hidden bg-neutral-900 rounded-none border border-neutral-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={coll.image}
                    alt={coll.displayTitle}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-108 opacity-75 group-hover:opacity-90"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Dark sleek gradient shield */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-6 sm:p-8 flex flex-col justify-end text-white h-3/5 whitespace-normal transition-all duration-350 group-hover:bg-black/80" />
                  
                  {/* Content text */}
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-white h-3/5 whitespace-normal z-20">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-sans font-bold text-white/60 mb-1 group-hover:text-[#c9a96e] transition-colors">
                      {coll.tagline}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-serif text-white tracking-wide transition-transform duration-300 group-hover:-translate-y-1">
                      {coll.displayTitle}
                    </h3>
                    
                    {/* Elegant fine-line CTA overlay hover reveal */}
                    <div className="overflow-hidden h-0 group-hover:h-8 transition-all duration-350 ease-out mt-1">
                      <Link
                        to={`/shop?category=${coll.category}`}
                        className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#c9a96e] hover:text-white flex items-center space-x-1.5 border-b border-[#c9a96e]/60 w-fit pb-1"
                      >
                        <span>KHÁM PHÁ CATALOGUE</span>
                        <ArrowRight size={11} />
                      </Link>
                    </div>

                    {/* Display fine link default for static touch */}
                    <div className="block group-hover:hidden mt-2">
                      <Link
                        to={`/shop?category=${coll.category}`}
                        className="text-[10px] tracking-widest font-sans font-bold uppercase text-white/70 border-b border-white/20 pb-0.5 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all"
                      >
                        KHÁM PHÁ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Section 2: New Arrivals with Interactive Quick Filter */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 bg-[#faf8f5] relative overflow-hidden"
      >
        {/* Subtle decorative background gold/neutral blur patterns */}
        <div className="absolute top-[45%] right-[-120px] w-80 h-80 rounded-full bg-[#c9a96e]/6 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-100px] w-72 h-72 rounded-full bg-[#c9a96e]/3 blur-[90px] pointer-events-none" />
        {/* Dynamic header row with custom boutique filters */}
        <div className="flex flex-col xl:flex-row items-center xl:items-end justify-between gap-6 mb-12 border-b border-neutral-200 pb-8">
          <div className="text-center xl:text-left space-y-2">
            <span className="text-[10px] tracking-[0.3em] font-sans font-bold text-neutral-400 uppercase">
              XU HƯỚNG MỚI NHẤT
            </span>
            <h2 className="text-2xl sm:text-4xl font-sans font-light text-neutral-900 tracking-tight">
              New Arrivals <span className="font-serif italic font-normal text-[#c9a96e] text-2xl sm:text-3.5xl">Mới Ra Mắt</span>
            </h2>
          </div>

          {/* Interactive filter toggle buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'TẤT CẢ' },
              { id: 'women', label: 'NỮ' },
              { id: 'men', label: 'NAM' },
              { id: 'shoes', label: 'GIÀY' },
              { id: 'accessories', label: 'PHỤ KIỆN' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCat(tab.id as any)}
                className={`px-4 py-2 text-[9px] sm:text-[10px] tracking-widest font-sans font-bold transition-all border shadow-xs ${
                  selectedCat === tab.id
                    ? 'bg-[#c9a96e] text-black border-[#c9a96e]'
                    : 'bg-white text-neutral-500 border-neutral-200 hover:border-[#c9a96e] hover:text-[#c9a96e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <Link
            to="/shop?filter=new"
            className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold text-neutral-900 hover:text-[#c9a96e] border-b border-neutral-900 hover:border-[#c9a96e] pb-1 flex items-center space-x-1.5 transition-all self-center xl:self-end mt-4 xl:mt-0"
          >
            <span>TẤT CẢ MẪU MỚI</span>
            <ArrowRight size={12} className="text-[#c9a96e]" />
          </Link>
        </div>

        {/* Animated grid reacting seamlessly to categories */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedCat}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-10"
          >
            {newArrivals.length > 0 ? (
              newArrivals.map((product) => (
                <div key={product.id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center">
                <p className="text-xs font-sans text-neutral-400 tracking-widest uppercase">
                  Không tìm thấy sản phẩm mới thích hợp trong nhóm này.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* Section 3: Premium Editorial Split Lookbook magazine style banner */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollScaleIn}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden"
      >
        {/* Asymmetrical magazine fold structure */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white border border-neutral-200/60 p-6 md:p-12 items-center shadow-xs">
          
          {/* Left Column: Overlapping Visual stack with dynamic stamp */}
          <div className="lg:col-span-6 relative h-[400px] sm:h-[500px] w-full overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="relative w-full h-full group bg-neutral-100"
            >
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1600&auto=format&fit=crop&q=80"
                alt="Slow living elegant lookbook"
                className="w-full h-full object-cover object-center scale-100 group-hover:scale-105 transition-transform duration-[4000ms] opacity-90"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay shadow layer */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-transparent to-transparent h-2/5 p-8 flex lg:hidden flex-col justify-end text-white" />
            </motion.div>
            
            {/* Fine line border layout for editorial print feel */}
            <div className="absolute inset-4 border border-white/20 pointer-events-none z-10" />
            
            {/* Stamp label */}
            <div className="absolute bottom-6 left-6 bg-white py-1.5 px-3 z-20 shadow-sm text-[8px] sm:text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-neutral-800 border border-neutral-200">
              ISSUE NO. 04 / SPRING COUTURE
            </div>
          </div>

          {/* Right Column: Editorial Text, Quotes, and Fine details */}
          <div className="lg:col-span-6 space-y-8 px-2 lg:px-6 relative">
            <div className="space-y-4">
              <div className="inline-flex items-center text-[#c9a96e] gap-2">
                <Sparkles size={12} />
                <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-bold">
                  Aura Premium Editorial Guide
                </span>
              </div>
              
              <h2 className="text-3xl sm:text-4.5xl font-sans font-light tracking-tight leading-tight text-neutral-900">
                Nghệ Thuật Của <br />
                <span className="font-serif italic font-normal text-[#c9a96e] text-4xl sm:text-5xl">
                  Sự Tối Giản
                </span>
              </h2>
              
              <div className="h-px w-20 bg-neutral-200" />
            </div>

            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed font-sans font-light">
              Phá bỏ những ồn ào thời trang công nghiệp. Tại Fashion Aura, chúng tôi tôn vinh cái đẹp của phom dáng thoải mái bền vững, biến mỗi bộ cánh trở thành lời tuyên ngôn cá nhân đĩnh đạc và rực rỡ nhất.
            </p>

            {/* Editorial quote block */}
            <div className="border-l-2 border-[#c9a96e] pl-4 py-1 italic text-xs sm:text-sm text-neutral-600 font-serif">
              "We design with focus on drape, clean profiles, and rich raw textiles crafted to be treasured for generations."
            </div>

            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="group inline-flex items-center justify-center relative bg-[#c9a96e] hover:bg-[#b8945a] text-black tracking-[0.25em] text-[10px] font-sans font-bold uppercase py-4 px-8 rounded-none transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <span>KHÁM PHÁ LOOKBOOK</span>
                <ArrowRight size={12} className="ml-2 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Absolute decorative category index list on the right corner for large displays */}
          <div className="absolute right-8 bottom-8 hidden lg:block space-y-6 text-right z-20 pointer-events-none">
            <div className="space-y-1">
              <p className="text-[10px] tracking-[0.25em] text-neutral-800 font-bold uppercase">01 / FEMME</p>
              <p className="text-[10px] tracking-[0.25em] text-neutral-400 font-medium uppercase mt-1">02 / HOMME</p>
              <p className="text-[10px] tracking-[0.25em] text-neutral-400 font-medium uppercase mt-1">03 / ACCESSORIES</p>
            </div>
          </div>

        </div>
      </motion.section>

      {/* Featured Products Runway Slider */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeInUp}
        className="bg-white"
      >
        <ProductCarousel 
          products={products} 
          title="Featured Runway" 
          subtitle="Mẫu độc quyền tuyển chọn" 
          darkMode={false}
        />
      </motion.div>

      {/* Section 4: Web Best Sellers Showcase */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 bg-[#faf8f5] relative overflow-hidden"
      >
        <SectionTitle 
          title="Best Sellers" 
          subtitle="MẪU BÁN CHẠY NHẤT & KHÁCH HÀNG ƯA CHUỘNG" 
          variant="light"
        />

        {/* Outer instructions hint */}
        <p className="text-center text-[10px] text-neutral-400 font-sans tracking-[0.2em] uppercase mb-10 -mt-6">
          Hover hoặc click lên sản phẩm để xem chi tiết thiết kế
        </p>

        {/* Deluxe Accordion Canvas */}
        <div className="flex flex-col lg:flex-row w-full lg:h-[550px] gap-4 lg:gap-3 items-stretch select-none">
          {bestSellers.map((product, index) => {
            const isActive = activeBestSellerIdx === index;
            const categoryMap = {
              women: 'Thời Trang Nữ',
              men: 'Thời Trang Nam',
              shoes: 'Giày Cao Cấp',
              accessories: 'Phụ Kiện'
            };
            const categoryLabel = categoryMap[product.category] || 'Sản Phẩm';
            const subLabel = `0${index + 1} / ${categoryLabel.toUpperCase()}`;

            return (
              <motion.div
                key={product.id}
                onMouseEnter={() => setActiveBestSellerIdx(index)}
                onClick={() => setActiveBestSellerIdx(index)}
                animate={{
                  flex: isActive ? 4.2 : 1,
                  height: isActive ? "450px" : "auto"
                }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{
                  duration: 0.45,
                  ease: [0.25, 1, 0.3, 1]
                }}
                className={`relative overflow-hidden cursor-pointer rounded-2xl border flex flex-col justify-end group transition-colors transition-shadow duration-300 ${
                  isActive 
                    ? 'border-[#c9a96e]/60 shadow-2xl scale-[1.01]' 
                    : 'border-neutral-200/85 hover:border-[#c9a96e]/50 hover:shadow-lg'
                } ${
                  // On mobile, dormant is small row height, active is expanded
                  isActive ? 'h-[440px] lg:h-full' : 'h-[85px] lg:h-full'
                }`}
              >
                {/* Background Image Layer with custom filters */}
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
                  <motion.img
                    src={product.image}
                    alt={product.name}
                    animate={{ scale: isActive ? 1.05 : 1.0 }}
                    transition={{ duration: 0.45, ease: [0.25, 1, 0.3, 1] }}
                    className={`w-full h-full object-cover object-center transition-[filter,brightness] duration-300 ${
                      isActive ? 'grayscale-0 brightness-[0.7] contrast-[1.03]' : 'grayscale brightness-[0.4] contrast-100 group-hover:brightness-[0.55]'
                    }`}
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle shade gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent transition-opacity duration-300" />
                </div>

                {/* Vertical Sidebar Rotated Label (Only visible on Desktop when card is Dormant) */}
                {!isActive && (
                  <div className="absolute inset-0 hidden lg:flex flex-col justify-between p-6 h-full select-none rotate-180 [writing-mode:vertical-lr] items-center pointer-events-none">
                    <span className="text-[9px] tracking-[0.25em] text-[#c9a96e] font-extrabold uppercase bg-black/40 px-2 py-1 rounded-sm backdrop-blur-xs select-none">
                      ★ {product.rating}
                    </span>
                    <span className="text-sm tracking-[0.32em] text-white/70 uppercase font-serif font-light select-none group-hover:text-white group-hover:tracking-[0.35em] transition-all duration-300">
                      {product.name}
                    </span>
                  </div>
                )}

                {/* Horizontal Label for Mobile/Tablet Dormant state */}
                {!isActive && (
                  <div className="absolute inset-0 lg:hidden flex items-center justify-between px-6 py-4 pointer-events-none select-none">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-full bg-neutral-900 border border-[#c9a96e]/35 flex items-center justify-center text-xs text-[#c9a96e] font-bold">
                        ★
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[8px] tracking-widest text-[#c9a96e] uppercase font-mono">{subLabel}</span>
                        <span className="text-sm tracking-wide text-white font-serif">{product.name}</span>
                      </div>
                    </div>
                    <span className="text-white/40 text-[10px] tracking-widest font-mono uppercase">LẬT MỞ ✦</span>
                  </div>
                )}

                {/* Active Rich Content overlay panel */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ delay: 0.05, duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex flex-col justify-end text-white z-10 select-none bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                    >
                      {/* Top floating gold badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-[#c9a96e] font-serif pr-1 flex items-center gap-1">
                          ★ <span className="font-sans font-bold">{product.rating}</span>
                        </span>
                        <span className="text-[9px] uppercase tracking-[0.28em] font-sans font-extrabold text-[#c9a96e]">
                          {subLabel}
                        </span>
                      </div>

                      {/* Main Title & Price */}
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-6">
                        <h3 className="text-2xl sm:text-3xl font-serif text-white tracking-wide">
                          {product.name}
                        </h3>
                        <span className="text-lg sm:text-xl font-sans font-bold text-[#c9a96e] whitespace-nowrap">
                          {formatPrice(product.price)}
                        </span>
                      </div>

                      {/* Direct action CTA button */}
                      <div>
                        <Link
                          to={`/product/${product.id}`}
                          className="group inline-flex items-center gap-2 bg-[#c9a96e] text-black font-sans text-[10px] tracking-widest font-extrabold uppercase py-3.5 px-6 rounded-none hover:bg-white transition-all shadow-md hover:shadow-xl w-fit"
                        >
                          <span>XEM CHI TIẾT SẢN PHẨM</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Editorial Split Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeInUp}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-neutral-200/60 bg-white shadow-xs">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col justify-center p-12 lg:p-16 bg-white border-b lg:border-b-0 lg:border-r border-neutral-200/60"
          >
            <span className="text-[#c9a96e] text-[10px] tracking-[0.3em] uppercase font-sans mb-6">Về Thương Hiệu</span>
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-neutral-900 leading-tight mb-6">
              Thời Trang <br /><span className="italic font-semibold text-[#c9a96e]">Là Nghệ Thuật</span>
            </h2>
            <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-md font-sans font-light">
              Fashion Aura ra đời từ tình yêu với những đường may tinh xảo và chất liệu bền vững. 
              Mỗi sản phẩm là sự kết hợp giữa nghề thủ công Sài Gòn và ngôn ngữ thời trang quốc tế.
            </p>
            <Link 
              to="/shop" 
              className="text-[#c9a96e] text-[11px] tracking-[0.2em] uppercase font-sans font-semibold flex items-center gap-2 w-fit hover:gap-4 transition-all"
            >
              Khám Phá Thêm <ArrowRight size={14} />
            </Link>
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative h-80 lg:h-auto overflow-hidden bg-neutral-100"
          >
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=85"
              alt="Fashion Editorial"
              className="w-full h-full object-cover object-center opacity-95 hover:opacity-100 hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xs border border-neutral-200 px-4 py-3 shadow-xs">
              <p className="text-neutral-800 text-[10px] tracking-widest uppercase font-sans font-semibold">Handcrafted in Saigon</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Section 5: Why Choose Us (Redefined as High-Fashion Atelier Commitments Directory) */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollFadeInUp}
        className="py-24 bg-[#faf8f5] border-t border-neutral-200/50"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <SectionTitle 
            title="Atelier Commitments" 
            subtitle="ĐẶC QUYỀN THƯƠNG HIỆU AURA" 
            variant="light"
          />

          <motion.div 
            variants={containerStagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y md:divide-y-0 md:divide-x divide-neutral-200/80 border border-neutral-200/80 bg-white shadow-xs"
          >
            {/* Pillar 1 */}
            <motion.div 
              variants={itemStagger}
              className="p-8 sm:p-10 space-y-5 transition-all duration-300 hover:bg-neutral-50/50 group flex flex-col justify-between hover:-translate-y-2 transition-transform"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-50 border border-neutral-200 text-[#c9a96e] font-serif italic text-lg select-none group-hover:bg-[#c9a96e] group-hover:text-black group-hover:border-[#c9a96e] transition-all duration-300 shadow-xs">
                  01
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-neutral-800">
                  PREMIUM FABRICS
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">
                  Độc quyền chất liệu dệt thô tự nhiên, được ngâm và xử lý thủ công, thân thiện làn da nhạy cảm và giữ phom dáng tuyệt đỉnh.
                </p>
              </div>
              <div className="h-px bg-neutral-100 group-hover:bg-[#c9a96e]/30 transition-all mt-4" />
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              variants={itemStagger}
              className="p-8 sm:p-10 space-y-5 transition-all duration-300 hover:bg-neutral-50/50 group flex flex-col justify-between hover:-translate-y-2 transition-transform"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-50 border border-neutral-200 text-[#c9a96e] font-serif italic text-lg select-none group-hover:bg-[#c9a96e] group-hover:text-black group-hover:border-[#c9a96e] transition-all duration-300 shadow-xs">
                  02
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-neutral-800">
                  ATELIER CRAFTED
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">
                  Phom dáng hoàn thiện tỉ mỉ bằng tay tại xưởng may Sài Gòn bởi những người thợ lành nghề bậc nhất qua hàng chục giờ kiểm soát.
                </p>
              </div>
              <div className="h-px bg-neutral-100 group-hover:bg-[#c9a96e]/30 transition-all mt-4" />
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              variants={itemStagger}
              className="p-8 sm:p-10 space-y-5 transition-all duration-300 hover:bg-neutral-50/50 group flex flex-col justify-between hover:-translate-y-2 transition-transform"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-50 border border-neutral-200 text-[#c9a96e] font-serif italic text-lg select-none group-hover:bg-[#c9a96e] group-hover:text-black group-hover:border-[#c9a96e] transition-all duration-300 shadow-xs">
                  03
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-neutral-800">
                  ART OF SLOW LIVING
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">
                  Nâng niu giá trị trường tồn. Thiết kế đa năng phối hợp linh hoạt cùng tủ đồ, bền bỉ với thời gian, rời xa xu hướng công nghiệp.
                </p>
              </div>
              <div className="h-px bg-neutral-100 group-hover:bg-[#c9a96e]/30 transition-all mt-4" />
            </motion.div>

            {/* Pillar 4 */}
            <motion.div 
              variants={itemStagger}
              className="p-8 sm:p-10 space-y-5 transition-all duration-300 hover:bg-neutral-50/50 group flex flex-col justify-between hover:-translate-y-2 transition-transform"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-50 border border-neutral-200 text-[#c9a96e] font-serif italic text-lg select-none group-hover:bg-[#c9a96e] group-hover:text-black group-hover:border-[#c9a96e] transition-all duration-300 shadow-xs">
                  04
                </div>
                <h3 className="text-xs uppercase tracking-[0.2em] font-sans font-bold text-neutral-800">
                  BESPOKE PRIVILEGES
                </h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light font-sans">
                  Đóng gói dạng quà tặng nước hoa sang trọng, hỗ trợ chỉnh sửa kích thước vừa khít số đo của bạn miễn phí hoặc đổi trả tận tâm.
                </p>
              </div>
              <div className="h-px bg-neutral-100 group-hover:bg-[#c9a96e]/30 transition-all mt-4" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Newsletter */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={scrollScaleIn}
        className="bg-[#c9a96e] py-20"
      >
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div>
            <span className="text-black/50 text-[10px] tracking-[0.3em] uppercase font-sans">Ưu đãi độc quyền</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-light text-black mt-3 mb-4">
              Đăng Ký Nhận <span className="font-semibold italic">Ưu Đãi VIP</span>
            </h2>
            <p className="text-black/60 text-sm mb-8 font-sans">Nhận thông báo bộ sưu tập mới và ưu đãi đặc biệt dành riêng cho hội viên.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-0 max-w-md mx-auto">
              <input 
                type="text" 
                placeholder="Email của bạn..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-5 py-4 bg-black/10 text-black placeholder-black/40 text-sm font-sans focus:outline-none focus:bg-black/20 border border-black/10"
              />
              <button
                type="submit"
                className="bg-black text-[#c9a96e] px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-sans font-bold hover:bg-black/85 transition-colors whitespace-nowrap"
              >
                Đăng Ký
              </button>
            </form>
          </div>
        </div>
      </motion.section>

    </div>
  );
};

