import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Heart, User, Menu, X, ArrowRight, LogOut } from 'lucide-react';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { getCartCount } from '../utils/cartUtils';

export const Navbar: React.FC = () => {
  const { cart, user, wishlist, logoutUser } = useCartAndAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = getCartCount(cart);
  const totalWishlist = wishlist ? wishlist.length : 0;
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const menuItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Cửa hàng', path: '/shop' },
    { label: 'Liên hệ', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 focus:outline-none">
            <span className="font-sans text-xl md:text-2xl font-light tracking-[0.18em] text-neutral-950">
              FASHION <span className="font-semibold text-neutral-900">AURA</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative py-2 text-xs uppercase tracking-widest font-medium transition-colors duration-300 ${
                    isActive ? 'text-neutral-950 font-semibold' : 'text-neutral-500 hover:text-neutral-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-neutral-950"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right side controls (Wishlist, Cart, User, Auth) */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Wishlist Link */}
            <Link to="/wishlist" className="relative group p-2 focus:outline-none" aria-label="Danh sách yêu thích">
              <Heart size={20} className="text-neutral-700 group-hover:text-red-500 transition-colors" />
              <AnimatePresence>
                {totalWishlist > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm"
                  >
                    {totalWishlist}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Cart Link with beautiful bouncing Badge */}
            <Link to="/cart" className="relative group p-2 focus:outline-none" aria-label="Giỏ hàng">
              <ShoppingBag size={20} className="text-neutral-700 group-hover:text-neutral-950 transition-colors" />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 py-1 px-3 border border-neutral-150 hover:border-neutral-950 transition-colors rounded-sm"
                >
                  <User size={14} className="text-neutral-600" />
                  <span className="text-xs font-medium text-neutral-700 hover:text-neutral-950">
                    {user.fullName.split(' ').pop()}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors focus:outline-none"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-widest font-medium py-2 px-3 text-neutral-500 hover:text-neutral-950 transition-colors"
                >
                  Đăng Nhập
                </Link>
                <span className="text-neutral-200">/</span>
                <Link
                  to="/register"
                  className="text-xs uppercase tracking-widest font-semibold py-2 px-3 bg-neutral-950 text-white rounded-sm hover:bg-neutral-800 transition-all shadow-sm"
                >
                  Đăng Ký
                </Link>
              </div>
            )}
          </div>

          {/* Mobile controls (Wishlist + Cart Icon + Hamburger) */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/wishlist" className="relative p-2 focus:outline-none" aria-label="Danh sách yêu thích">
              <Heart size={21} className="text-neutral-700" />
              {totalWishlist > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                  {totalWishlist}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-2 focus:outline-none" aria-label="Giỏ hàng">
              <ShoppingBag size={21} className="text-neutral-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-950 text-[9px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-neutral-950 focus:outline-none"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-neutral-100 bg-white overflow-hidden"
          >
            <div className="space-y-1.5 px-4 pb-6 pt-4">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-3 px-2 text-sm uppercase tracking-widest font-medium border-b border-neutral-50 ${
                      isActive ? 'text-neutral-950 font-bold bg-neutral-50' : 'text-neutral-600'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}

              {user ? (
                <>
                  <NavLink
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 py-3 px-2 text-sm uppercase tracking-widest font-medium border-b border-neutral-50 text-neutral-600"
                  >
                    <User size={16} /> Hồ sơ cá nhân ({user.fullName})
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 py-3 px-2 text-sm uppercase tracking-widest font-medium text-red-600"
                  >
                    <LogOut size={16} /> Đăng xuất
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-center items-center py-3 text-xs uppercase tracking-widest font-semibold border border-neutral-200 text-neutral-700 rounded-sm"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-center items-center py-3 text-xs uppercase tracking-widest font-semibold bg-neutral-950 text-white rounded-sm"
                  >
                    Đăng Ký
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
