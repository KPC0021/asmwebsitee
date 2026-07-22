import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { formatPrice } from '../data/products';
import { SectionTitle } from '../components/SectionTitle';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, user, showToast } = useCartAndAuth();

  const handleRemove = (productId: string, size: string) => {
    removeFromCart(productId, size);
  };

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = subtotal >= 1000000 || subtotal === 0 ? 0 : 35000;
  const grandTotal = subtotal + shippingFee;

  const handleProceed = () => {
    if (cart.length === 0) {
      showToast('Giỏ hàng trống! Hãy chọn sản phẩm trước.', 'error');
      return;
    }
    // Standard protocol: they can checkout as guest, but let's prompt or direct them
    if (!user) {
      showToast('Hãy Đăng Nhập hoặc Đăng Ký thành viên để nhận đặc quyền tích điểm trước khi đặt hàng!', 'info');
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-[#FAF9F6] py-12 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          title="Shopping Cart"
          subtitle="Giỏ hàng của nàng"
        />

        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
            
            {/* Left Col: Cart item cards list (7/12 layout) */}
            <div className="lg:col-span-8 space-y-4">
              <div className="bg-white border border-neutral-100 p-6 shadow-sm rounded-sm">
                
                {/* Table Header Row */}
                <div className="hidden md:grid grid-cols-12 pb-4 border-b border-neutral-100 text-[10px] font-sans font-extrabold uppercase text-neutral-400 tracking-wider">
                  <div className="col-span-6">Sản Phẩm</div>
                  <div className="col-span-2 text-center">Đơn Giá</div>
                  <div className="col-span-2 text-center">Số Lượng</div>
                  <div className="col-span-2 text-right">Tổng Tiền</div>
                </div>

                {/* Items display list inside table with animations */}
                <div className="divide-y divide-neutral-100">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <motion.div
                        key={`${item.product.id}-${item.selectedSize}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-12 py-5 items-center gap-4"
                      >
                        {/* Thumbnail image and details name */}
                        <div className="col-span-12 md:col-span-6 flex items-center space-x-4">
                          <div className="w-16 h-20 bg-neutral-100 shrink-0 select-none rounded-sm overflow-hidden border border-neutral-100">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-cover object-center"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 font-sans tracking-wide">
                              {item.product.category}
                            </span>
                            <h3 className="text-xs font-semibold text-neutral-900 leading-normal hover:text-neutral-600">
                              <Link to={`/product/${item.product.id}`}>
                                {item.product.name}
                              </Link>
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 font-mono rounded-none border border-neutral-200">
                                Size: {item.selectedSize}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price identifier */}
                        <div className="col-span-4 md:col-span-2 text-left md:text-center">
                          <span className="text-[10px] md:hidden text-neutral-400 mr-2 uppercase tracking-wider font-semibold">Đơn giá:</span>
                          <span className="text-xs text-neutral-800 font-sans font-semibold">
                            {formatPrice(item.product.price)}
                          </span>
                        </div>

                        {/* Quantifier editor form buttons */}
                        <div className="col-span-4 md:col-span-2 flex justify-start md:justify-center">
                          <div className="flex items-center border border-neutral-250 bg-neutral-50 h-8 rounded-sm overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity - 1)}
                              aria-label="Decrease"
                              className="w-8 h-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
                            >
                              <Minus size={11} />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-neutral-800 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                              aria-label="Increase"
                              className="w-8 h-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
                            >
                              <Plus size={11} />
                            </button>
                          </div>
                        </div>

                        {/* Calculated Subtotals info */}
                        <div className="col-span-4 md:col-span-2 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                          <span className="text-[10px] md:hidden text-neutral-400 uppercase tracking-wider font-semibold">Tổng:</span>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-neutral-900 font-semibold font-sans">
                              {formatPrice(item.product.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => handleRemove(item.product.id, item.selectedSize)}
                              className="text-neutral-300 hover:text-red-650 p-1 rounded-sm focus:outline-none focus:text-red-500 hover:bg-neutral-50 transition-colors"
                              title="Xóa mẫu này"
                            >
                              <Trash2 size={13} className="text-neutral-400 hover:text-red-600" />
                            </button>
                          </div>
                        </div>

                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Continue Shopping button */}
                <div className="pt-6 border-t border-neutral-100 flex items-center">
                  <Link
                    to="/shop"
                    className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-bold text-neutral-600 hover:text-neutral-950 transition-colors"
                  >
                    <ArrowLeft size={14} />
                    <span>Tiếp tục mua hàng</span>
                  </Link>
                </div>

              </div>
            </div>

            {/* Right Col: Summary card & payment guidelines (4/12 layout) */}
            <div className="lg:col-span-4">
              <div className="bg-white border border-neutral-100 p-6 md:p-8 shadow-sm rounded-sm space-y-6">
                
                <h4 className="font-sans text-xs font-extrabold uppercase tracking-widest text-neutral-900 pb-3 border-b border-neutral-100">
                  Tạm tính hóa đơn
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Bill Subtotal */}
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>Tổng tiền hàng</span>
                    <span className="font-semibold font-sans">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Shipping option */}
                  <div className="flex justify-between items-center text-neutral-600">
                    <span>Phí vận chuyển</span>
                    <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                  </div>

                  {/* Free shipping helper badge */}
                  {shippingFee > 0 && (
                    <div className="bg-[#faf9f6] p-3 text-[10px] text-neutral-500 leading-relaxed rounded-none border border-neutral-150">
                      Mua thêm <strong>{formatPrice(1000000 - subtotal)}</strong> để nhận đặc quyền <strong>Giao hàng miễn phí</strong>!
                    </div>
                  )}

                  {/* Divider */}
                  <div className="h-[1px] bg-neutral-100 my-4"></div>

                  {/* Total bill count */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-neutral-900 uppercase tracking-wider text-xs">Tổng cộng thanh toán</span>
                    <span className="font-black text-neutral-950 text-base font-sans">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Proceed Checkout triggers button */}
                <div className="pt-4">
                  <button
                    onClick={handleProceed}
                    className="w-full bg-neutral-950 hover:bg-neutral-850 text-white font-sans text-xs uppercase tracking-widest font-bold py-4.5 rounded-none flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <span>Tiếp tục thanh toán</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {/* Secure assurance card details */}
                <div className="border-t border-neutral-100 pt-6 space-y-4 text-[10px] text-neutral-400 font-sans">
                  <div className="flex items-start space-x-2">
                    <ShieldCheck size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span>Dữ liệu giao dịch được mã hóa SSL/TLS tuyệt đối an toàn.</span>
                  </div>
                  <div className="flex items-start space-x-2 font-medium">
                    <HelpCircle size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                    <span>Hỗ trợ tư vấn hỗ trợ và giải mã đơn lỗi: <strong>+84 (0) 90 123 4567</strong></span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-24 bg-white border border-neutral-100 mt-12 rounded-sm space-y-6 max-w-xl mx-auto p-8 shadow-sm">
            <ShoppingBag className="text-neutral-250 mx-auto" size={40} />
            <h3 className="text-lg font-sans font-medium text-neutral-800">Giỏ hàng của nàng chưa có sản phẩm</h3>
            <p className="text-xs text-neutral-450 max-w-sm mx-auto leading-relaxed">
              Mời nàng quay trở lại gian hàng để tìm chọn những sản phẩm thời trang cao cấp hoàn hảo nâng niu khí chất bản thân.
            </p>
            <Link
              to="/shop"
              className="bg-neutral-950 text-white uppercase tracking-widest text-xs font-bold py-3.5 px-8 inline-block rounded-none shadow-md hover:bg-neutral-800 transition"
            >
              Mở Trang Bộ Sưu Tập
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
