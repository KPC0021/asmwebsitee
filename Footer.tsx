import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Clock, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 font-sans pt-16 pb-8 border-t border-neutral-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <span className="font-sans text-lg font-light tracking-[0.2em] text-white">
              FASHION <span className="font-semibold text-white">AURA</span>
            </span>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm pt-2">
              Chúng tôi kiến tạo phong cách tối giản thời thượng cho cuộc sống hiện đại. Mỗi thiết kế tại Fashion Aura đều là kết tinh của chất liệu cao cấp và kỹ nghệ may mặc sắc sảo thượng thặng.
            </p>
            <div className="flex space-x-4 pt-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-neutral-950 hover:border-white transition-all text-neutral-400"
                title="Instagram Fashion Aura"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 rounded-full border border-neutral-800 flex items-center justify-center hover:bg-white hover:text-neutral-950 hover:border-white transition-all text-neutral-400"
                title="Facebook Fashion Aura"
              >
                <Facebook size={15} />
              </a>
              <span className="text-[10px] tracking-widest font-semibold uppercase text-neutral-500 py-2.5">
                @fashion.aura
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-white text-xs uppercase tracking-widest font-semibold">Đường dẫn nhanh</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-white transition-colors">Trang chủ</Link>
              </li>
              <li>
                <Link to="/shop" className="text-neutral-400 hover:text-white transition-colors">Bộ sưu tập / Cửa hàng</Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">Liên hệ bộ phận CSKH</Link>
              </li>
              <li>
                <Link to="/cart" className="text-neutral-400 hover:text-white transition-colors">Giỏ hàng và thanh toán</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care policies */}
          <div className="space-y-4">
            <h4 className="text-white text-xs uppercase tracking-widest font-semibold">Dịch vụ & Chính sách</h4>
            <ul className="space-y-2.5 text-xs text-neutral-400">
              <li className="hover:text-white transition-colors list-none cursor-pointer">Giao hàng hoả tốc nhận ngày</li>
              <li className="hover:text-white transition-colors list-none cursor-pointer">Bảo hành giặt là miễn phí 30 ngày</li>
              <li className="hover:text-white transition-colors list-none cursor-pointer">Đổi trả linh hoạt tận nhà toàn quốc</li>
              <li className="hover:text-white transition-colors list-none cursor-pointer">Tìm kiếm showroom gần nhất</li>
            </ul>
          </div>

          {/* Showroom & Contact info */}
          <div className="space-y-4">
            <h4 className="text-white text-xs uppercase tracking-widest font-semibold">Showroom Atelier</h4>
            <ul className="space-y-3.5 text-xs text-neutral-400">
              <li className="flex items-start space-x-2.5">
                <MapPin size={15} className="text-neutral-500 shrink-0 mt-0.5" />
                <span>88 Đồng Khởi, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone size={14} className="text-neutral-500 shrink-0" />
                <span>+84 (0) 90 123 4567</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail size={14} className="text-neutral-500 shrink-0" />
                <span>support@fashionaura.vn</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Clock size={14} className="text-neutral-500 shrink-0" />
                <span>Mở cửa hàng ngày: 09:00 - 21:30</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright copy and back to top */}
        <div className="border-t border-neutral-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-neutral-500 text-[11px]">
          <span>&copy; {new Date().getFullYear()} Fashion Aura. All rights reserved. Designed to elevate your style.</span>
          <button
            onClick={scrollToTop}
            className="mt-4 sm:mt-0 flex items-center space-x-1 hover:text-white transition-colors focus:outline-none text-[10px] uppercase tracking-widest font-semibold"
          >
            <span>Lên đầu trang</span>
            <ArrowUp size={12} />
          </button>
        </div>

      </div>
    </footer>
  );
};
