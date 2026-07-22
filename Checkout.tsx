import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { formatPrice } from '../data/products';
import { SectionTitle } from '../components/SectionTitle';
import { validateFullName, validatePhone, validateAddress } from '../utils/validation';
import { initiatePayment, PaymentMethod } from '../utils/payment';
import { ShieldCheck, ArrowLeft, CreditCard, CheckCircle2, Ticket, Sparkles, Loader2, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, user, clearCart, showToast, updateUserProfile } = useCartAndAuth();

  // If cart is empty, redirect to shop or cart
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  // Delivery shipping Form states
  const [shippingForm, setShippingForm] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    address: user?.address || '',
    note: '',
  });

  const [errors, setErrors] = useState<Partial<typeof shippingForm>>({});

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  // Loading/Gateway redirection states
  const [isProcessing, setIsProcessing] = useState(false);
  const [gatewayMessage, setGatewayMessage] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');

  // Discount code coupon mock
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = subtotal >= 1000000 ? 0 : 35000;
  const grandTotal = subtotal + shippingFee - discountAmount;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase().trim() === 'AURANEW') {
      const discount = Math.floor(subtotal * 0.1); // 10% discount
      setDiscountAmount(discount);
      setAppliedCoupon('AURANEW (10%)');
      setCouponCode('');
      showToast('Đã áp dụng mã giảm giá 10% cho đơn hàng đầu tiên!', 'success');
    } else if (couponCode.toUpperCase().trim() === 'FASHIONFREESHIP') {
      setDiscountAmount(shippingFee);
      setAppliedCoupon('MIỄN PHÍ SHIP');
      setCouponCode('');
      showToast('Đã áp dụng mã miễn phí vận chuyển!', 'success');
    } else {
      showToast('Mã coupon không hợp lệ hoặc đã hết lượt áp dụng.', 'error');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<typeof shippingForm> = {};

    const nameErr = validateFullName(shippingForm.fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const phoneErr = validatePhone(shippingForm.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const addressErr = validateAddress(shippingForm.address);
    if (addressErr) newErrors.address = addressErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Vui lòng kiểm tra lại thông tin giao hàng.', 'error');
      return;
    }

    // Process payment
    setIsProcessing(true);

    if (paymentMethod !== 'cod') {
      setGatewayMessage("Redirecting to secure payment gateway...");
    } else {
      setGatewayMessage("Đang khởi tạo đơn hàng...");
    }

    try {
      const response = await initiatePayment(paymentMethod, grandTotal, {
        name: shippingForm.fullName,
        phone: shippingForm.phone,
        address: shippingForm.address,
        note: shippingForm.note,
        itemsCount: cart.length,
      });

      // Update user address defaults automatically if empty originally
      if (user && !user.address && shippingForm.address) {
        updateUserProfile({ address: shippingForm.address.trim() });
      }

      // Add to standard orders database in localStorage
      const storedOrdersStr = localStorage.getItem('fashion_aura_orders');
      const allOrders = storedOrdersStr ? JSON.parse(storedOrdersStr) : [];

      const newOrder = {
        orderId: response.orderId,
        date: new Date().toISOString(),
        total: grandTotal,
        status: paymentMethod === 'cod' ? 'processing' : 'shipping',
        paymentMethod: paymentMethod.toUpperCase(),
        userEmail: user?.email || 'guest@fashionaura.vn',
        items: cart.map(item => ({
          name: `${item.product.name} (Size ${item.selectedSize})`,
          quantity: item.quantity,
          price: item.product.price
        }))
      };

      localStorage.setItem('fashion_aura_orders', JSON.stringify([...allOrders, newOrder]));
      setPlacedOrderId(response.orderId);

      setIsProcessing(false);

      if (paymentMethod !== 'cod' && response.redirectUrl) {
        // Mocking redirection: Open sandbox link in popup but finish the layout flow nicely
        showToast(`Đã chuyển hướng thanh toán tới cổng ${paymentMethod.toUpperCase()}`, 'info');
        // We simulate success and show modal instead of forcing hard window.location changes in sandbox
        setIsSuccessModalOpen(true);
      } else {
        setIsSuccessModalOpen(true);
      }

    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      showToast('Có lỗi xảy ra trong quá trình khởi tạo thanh toán.', 'error');
    }
  };

  const handleFinishCheckout = () => {
    setIsSuccessModalOpen(false);
    clearCart();
    navigate('/profile');
  };

  const methodsList: { id: PaymentMethod; label: string; icon: string; desc: string }[] = [
    {
      id: 'cod',
      label: 'Cash on Delivery (COD)',
      icon: '💵',
      desc: 'Thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận sản phẩm Flat-pack túi.'
    },
    {
      id: 'card',
      label: 'Thẻ Quốc Tế Visa/Master/JCB',
      icon: '💳',
      desc: 'Bảo mật tuyệt đối, xử lý thanh toán tự động qua trung gian Stripe.'
    },
    {
      id: 'momo',
      label: 'Ví điện tử MoMo',
      icon: '🌸',
      desc: 'Quét mã QR qua ứng dụng MoMo để thanh toán hỏa tốc tức thời.'
    },
    {
      id: 'vnpay',
      label: 'Cổng VNPAY-QR',
      icon: '🏦',
      desc: 'Hỗ trợ quét QR-Pay của hơn 40 ngân hàng nội địa Việt Nam.'
    },
    {
      id: 'zalopay',
      label: 'Ví Điện Tử ZaloPay',
      icon: '📱',
      desc: 'Thanh toán siêu tốc không dùng tiền mặt, hoàn tiền chiết khấu cao.'
    }
  ];

  return (
    <div className="bg-[#FAF9F6] py-12 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link
          to="/cart"
          className="inline-flex items-center space-x-2 text-xs uppercase tracking-wider text-neutral-500 hover:text-neutral-900 transition-colors mb-8 focus:outline-none"
        >
          <ArrowLeft size={14} />
          <span>Quay lại giỏ hàng</span>
        </Link>

        <SectionTitle
          title="Secure Checkout"
          subtitle="Tiến hành thanh toán đơn hàng"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Left panel forms inputs (7/12 layout) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Shipping and Contact info form */}
            <div className="bg-white border border-neutral-100 p-6 md:p-8 shadow-sm rounded-sm">
              <h3 className="font-sans text-xs font-extrabold uppercase tracking-widest text-neutral-900 mb-6 pb-3 border-b border-neutral-100">
                1. Thông tin giao nhận hàng
              </h3>

              <form onSubmit={handlePlaceOrder} className="space-y-4">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Họ và Tên Người nhận *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingForm.fullName}
                    onChange={handleInputChange}
                    placeholder="Nguyễn Văn A"
                    className={`w-full px-4 py-2.5 text-xs text-neutral-800 bg-[#faf9f6]/40 border ${
                      errors.fullName ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                    } focus:outline-none rounded-none`}
                  />
                  {errors.fullName && <p className="text-[10px] text-red-500">{errors.fullName}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Số Điện Thoại Nhận hàng *</label>
                  <input
                    type="text"
                    name="phone"
                    value={shippingForm.phone}
                    onChange={handleInputChange}
                    placeholder="09xxxxxxxx"
                    className={`w-full px-4 py-2.5 text-xs text-neutral-800 bg-[#faf9f6]/40 border ${
                      errors.phone ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                    } focus:outline-none rounded-none`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Địa chỉ Nhận hàng chi tiết *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    onChange={handleInputChange}
                    placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP"
                    className={`w-full px-4 py-2.5 text-xs text-neutral-800 bg-[#faf9f6]/40 border ${
                      errors.address ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                    } focus:outline-none rounded-none`}
                  />
                  {errors.address && <p className="text-[10px] text-red-500">{errors.address}</p>}
                </div>

                {/* Note */}
                <div className="space-y-1.5">
                  <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Ghi chú giao hàng (Không bắt buộc)</label>
                  <textarea
                    name="note"
                    value={shippingForm.note}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Giao trong giờ hành chính, gọi điện trước khi giao..."
                    className="w-full px-4 py-2.5 text-xs text-neutral-800 bg-[#faf9f6]/40 border border-neutral-200 focus:border-neutral-950 focus:bg-white focus:outline-none rounded-none resize-none"
                  />
                </div>
              </form>
            </div>

            {/* Step 2: Payment options selection */}
            <div className="bg-white border border-neutral-100 p-6 md:p-8 shadow-sm rounded-sm">
              <h3 className="font-sans text-xs font-extrabold uppercase tracking-widest text-neutral-900 mb-6 pb-3 border-b border-neutral-100">
                2. Phương thức thanh toánan toàn
              </h3>

              <div className="space-y-3">
                {methodsList.map((m) => {
                  const isSelected = paymentMethod === m.id;
                  return (
                    <label
                      key={m.id}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`block p-4 border rounded-none cursor-pointer select-none transition-all ${
                        isSelected
                          ? 'border-neutral-950 bg-neutral-950/5 font-semibold'
                          : 'border-neutral-200 hover:border-neutral-450 bg-white'
                      }`}
                    >
                      <div className="flex items-start space-x-3 text-xs">
                        {/* Custom radio indicator */}
                        <div className="mt-1 h-3.5 w-3.5 border border-neutral-450 rounded-full flex items-center justify-center bg-white">
                          {isSelected && <div className="h-2 w-2 rounded-full bg-neutral-950"></div>}
                        </div>
                        <div className="flex-grow space-y-0.5">
                          <span className="text-neutral-900 flex items-center gap-2">
                            <span>{m.icon}</span> <span>{m.label}</span>
                          </span>
                          <p className="text-[10px] text-neutral-450 font-normal leading-relaxed">{m.desc}</p>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right panel Order Summary details (5/12 layout) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-neutral-100 p-6 md:p-8 shadow-sm rounded-sm space-y-6">
              
              <h3 className="font-sans text-xs font-extrabold uppercase tracking-widest text-neutral-900 pb-3 border-b border-neutral-100">
                Tóm tắt đơn hàng
              </h3>

              {/* Items included list thumbnail display details */}
              <div className="divide-y divide-neutral-100 max-h-[220px] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="flex items-center justify-between py-3 text-xs">
                    <div className="flex items-center space-x-3.5">
                      <div className="h-12 w-10 bg-neutral-105 shrink-0 rounded-sm overflow-hidden border border-neutral-100">
                        <img src={item.product.image} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-800 line-clamp-1">{item.product.name}</h4>
                        <span className="text-[10px] text-neutral-450">Size: {item.selectedSize} / SL: x{item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-neutral-900">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon applying card */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2 border-t border-b border-neutral-100 py-4">
                <input
                  type="text"
                  placeholder="Nhập mã coupon (AURANEW, FASHIONFREESHIP)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow px-3 py-2 text-xs border border-neutral-200 focus:outline-none focus:border-neutral-950 rounded-none uppercase"
                />
                <button
                  type="submit"
                  className="bg-neutral-950 hover:bg-neutral-850 text-white font-sans text-xs uppercase tracking-widest font-semibold px-4 rounded-none transition"
                >
                  Áp dụng
                </button>
              </form>

              {/* Numeric sum billing listings details */}
              <div className="space-y-3.5 text-xs text-neutral-600">
                <div className="flex justify-between items-center">
                  <span>Tổng giá trị hàng</span>
                  <span className="font-bold text-neutral-900 font-sans">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                </div>

                {/* Discount display */}
                {discountAmount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600 font-semibold bg-emerald-55/60 p-2 border border-emerald-110">
                    <span className="flex items-center gap-1"><Ticket size={12} /> Giảm giá ({appliedCoupon})</span>
                    <span>- {formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="h-[1px] bg-neutral-100 my-4"></div>

                <div className="flex justify-between items-center text-sm font-sans">
                  <span className="font-semibold text-neutral-900 uppercase tracking-wider text-xs">Tổng số thanh toán</span>
                  <span className="font-black text-neutral-950 text-base">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit triggers Place Order checkout button */}
              <div className="pt-4">
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="w-full bg-neutral-950 hover:bg-neutral-850 text-white font-sans text-xs uppercase tracking-widest font-bold py-4.5 rounded-none flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="animate-spin text-white" size={14} />
                      <span>{gatewayMessage}</span>
                    </>
                  ) : (
                    <span>Xác nhận đặt hàng</span>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center space-x-1 text-[10px] text-neutral-450 pt-2 font-mono">
                <ShieldCheck size={13} />
                <span>Thanh toán bảo mật an toàn 256-bit SSL</span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Modern Gateway Loading redirection backdrop spinner overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white p-4"
          >
            <div className="bg-white text-neutral-900 p-8 rounded-sm max-w-sm text-center shadow-2xl space-y-4">
              <Loader2 className="animate-spin text-neutral-950 mx-auto" size={40} />
              <h3 className="font-semibold text-base">{gatewayMessage}</h3>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                Chúng tôi đang thiết lập kết nối mã hóa tới máy chủ bảo mật thanh toán. Vui lòng không tắt trình duyệt hoặc tải lại trang này.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success checkout order place modal prompt popup */}
      <AnimatePresence>
        {isSuccessModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white p-8 max-w-md w-full text-center rounded-sm shadow-2xl space-y-6"
            >
              <div className="inline-flex h-14 w-14 rounded-full bg-emerald-50 text-emerald-500 items-center justify-center mt-2 border border-emerald-100">
                <CheckCircle2 size={36} className="fill-current text-white bg-emerald-500 rounded-full" />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] tracking-widest text-[#ce796b] font-bold uppercase">Congratulation!</span>
                <h3 className="font-sans text-xl font-bold text-neutral-950">Đặt Hàng Thành Công!</h3>
                <p className="text-xs font-mono font-bold text-neutral-500 bg-[#faf9f6] py-1 px-3 border border-neutral-200 inline-block">
                  MÃ ĐƠN HÀNG: {placedOrderId}
                </p>
              </div>

              <p className="text-xs text-neutral-600 leading-relaxed max-w-sm mx-auto">
                Cám ơn nàng đã lựa chọn tủ đồ thời trang Fashion Aura. Đơn hàng đang được bộ phận Atelier đóng gói cẩn trọng và chuẩn bị chuyển tới tay bạn trong thời gian sớm cực kỳ.
              </p>

              <button
                onClick={handleFinishCheckout}
                className="w-full bg-neutral-950 text-white hover:bg-neutral-850 font-sans text-xs uppercase tracking-widest font-extrabold py-4 rounded-none shadow-md transition-colors"
              >
                Xem chi tiết đơn hàng trong Hồ Sơ
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
