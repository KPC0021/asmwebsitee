import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { Contact } from './pages/Contact';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { Profile } from './pages/Profile';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Wishlist } from './pages/Wishlist';

// Context
import { CartAndAuthProvider, useCartAndAuth } from './context/CartAndAuthContext';
import { Info, CheckCircle2, AlertTriangle } from 'lucide-react';

// Scroll to top on route change helper
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Global Toast Component
const ToastNotification: React.FC = () => {
  const { toast } = useCartAndAuth();

  return (
    <AnimatePresence>
      {toast.type && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#0a0a0a]/95 backdrop-blur-md border border-[#c9a96e]/40 shadow-[0_15px_50px_rgba(0,0,0,0.7)] p-4 sm:p-5 rounded-none flex items-start gap-4"
        >
          {/* Icons depending on notification level */}
          {toast.type === 'success' && (
            <div className="h-9 w-9 bg-[#c9a96e]/10 text-[#c9a96e] flex items-center justify-center rounded-none shrink-0 border border-[#c9a96e]/30 animate-pulse">
              <CheckCircle2 size={16} />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="h-9 w-9 bg-white/5 text-[#c9a96e] flex items-center justify-center rounded-none shrink-0 border border-white/10">
              <Info size={16} />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="h-9 w-9 bg-red-950/20 text-red-400 flex items-center justify-center rounded-none shrink-0 border border-red-500/30">
              <AlertTriangle size={16} />
            </div>
          )}

          <div className="flex-grow space-y-1">
            <span className="text-[8px] uppercase tracking-[0.25em] text-[#c9a96e] font-bold font-sans block">
              Fashion Aura • Thông báo
            </span>
            <p className="text-xs font-sans font-light text-neutral-200 tracking-wide leading-relaxed">
              {toast.message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Routing App layout mapping
export default function App() {
  return (
    <CartAndAuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans">
          {/* Header */}
          <Navbar />

          {/* Main page content wrapper with route transitions */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/wishlist" element={<Wishlist />} />
            </Routes>
          </main>

          {/* Footers */}
          <Footer />

          {/* Toast Container markup */}
          <ToastNotification />
        </div>
      </Router>
    </CartAndAuthProvider>
  );
}
