import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartAndAuth } from '../context/CartAndAuthContext';
import { SectionTitle } from '../components/SectionTitle';
import { User as UserIcon, Mail, Phone, MapPin, Edit2, CheckCircle2, ShoppingBag, X, Calendar, DollarSign, Bookmark, ArrowRight, UserCheck, Eye, Truck, Package, Clock, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { validateFullName, validatePhone, validateAddress } from '../utils/validation';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUserProfile, logoutUser } = useCartAndAuth();

  // If user is not logged in, redirect to login
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Editing form states
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});

  // Simulated orders placed by this user (read from localStorage)
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<any | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName,
        phone: user.phone,
        address: user.address || '',
      });

      // Load simulated orders belonging to this user email
      try {
        const storedOrders = localStorage.getItem('fashion_aura_orders');
        if (storedOrders) {
          const allOrders = JSON.parse(storedOrders);
          const userOrders = allOrders.filter((ord: any) => ord.userEmail === user.email);
          setOrders(userOrders);
        } else {
          // Put a beautiful mock default order to showcase a professional dashboard
          const mockInitialOrders = [
            {
              orderId: 'FA-10931',
              date: '2026-05-18T10:30:00Z',
              total: 2140000,
              status: 'delivered', // processing, shipping, delivered, canceled
              paymentMethod: 'VNPAY',
              userEmail: user.email,
              items: [
                { name: 'Classic Silk Shirt (Size M)', quantity: 1, price: 890000 },
                { name: 'Linen Summer Dress (Size S)', quantity: 1, price: 1250000 }
              ]
            }
          ];
          localStorage.setItem('fashion_aura_orders', JSON.stringify(mockInitialOrders));
          setOrders(mockInitialOrders);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [user]);

  if (!user) return null;

  const handleEditToggle = () => {
    if (isEditing) {
      // Revert if canceling
      setFormData({
        fullName: user.fullName,
        phone: user.phone,
        address: user.address || '',
      });
      setErrors({});
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    const nameErr = validateFullName(formData.fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const phoneErr = validatePhone(formData.phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const addressErr = validateAddress(formData.address);
    if (addressErr) newErrors.address = addressErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Save profile attributes to Context state
    updateUserProfile({
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
    });
    setIsEditing(false);
  };

  // Status mapping
  const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
    processing: { label: 'Đang xử lý', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-100' },
    shipping: { label: 'Đang giao', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
    delivered: { label: 'Đã hoàn thành', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
    canceled: { label: 'Đã hủy đơn', color: 'text-neutral-500', bg: 'bg-neutral-50 border-neutral-100' },
  };

  return (
    <div className="bg-[#FAF9F6] py-12 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          title="My Atelier Account"
          subtitle="Hồ sơ tài khoản và lịch sử đặt hàng"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          
          {/* Left Panel: Profile View & Edit form */}
          <div className="lg:col-span-4 shrink-0">
            <div className="bg-white border border-neutral-100 p-6 shadow-sm rounded-sm space-y-6">
              
              {/* Profile Avatar & Metadata header */}
              <div className="text-center pb-6 border-b border-neutral-100">
                <div className="h-20 w-20 rounded-full bg-neutral-900 text-white flex items-center justify-center text-2xl font-light mx-auto mb-4 tracking-wider">
                  {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <h3 className="text-base font-semibold text-neutral-900 tracking-tight">{user.fullName}</h3>
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  MEMBER OF THE ATELIER CLUB
                </span>
              </div>

              {/* View/Edit toggle area */}
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleProfileSave}
                    className="space-y-4"
                  >
                    {/* Edit Name */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                        Họ và Tên
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-xs border ${
                          errors.fullName ? 'border-red-500' : 'border-neutral-200'
                        } focus:outline-none focus:border-neutral-950 bg-neutral-50/50`}
                      />
                      {errors.fullName && <p className="text-[9px] text-red-500">{errors.fullName}</p>}
                    </div>

                    {/* Edit Phone */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                        Số Điện Thoại
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-xs border ${
                          errors.phone ? 'border-red-500' : 'border-neutral-200'
                        } focus:outline-none focus:border-neutral-950 bg-neutral-50/50`}
                      />
                      {errors.phone && <p className="text-[9px] text-red-500">{errors.phone}</p>}
                    </div>

                    {/* Edit Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                        Địa chỉ giao hàng mặc định
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 text-xs border ${
                          errors.address ? 'border-red-500' : 'border-neutral-200'
                        } focus:outline-none focus:border-neutral-950 bg-neutral-50/50`}
                        placeholder="Số nhà, Tên đường, Quận, Thành phố"
                      />
                      {errors.address && <p className="text-[9px] text-red-500">{errors.address}</p>}
                    </div>

                    {/* Buttons form control */}
                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-grow bg-neutral-950 text-white font-sans text-[11px] uppercase tracking-widest font-bold py-2.5 hover:bg-neutral-850 transition"
                      >
                        Lưu Thay Đổi
                      </button>
                      <button
                        type="button"
                        onClick={handleEditToggle}
                        className="border border-neutral-250 text-neutral-600 px-3.5 py-2.5 text-[11px] uppercase tracking-widest font-semibold hover:border-neutral-950 transition"
                      >
                        Hủy
                      </button>
                    </div>

                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {/* Read Email */}
                    <div className="flex items-center space-x-3.5 py-2.5 border-b border-neutral-50">
                      <Mail size={15} className="text-neutral-400 shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-semibold">
                          E-commerce Email
                        </span>
                        <span className="text-xs font-semibold text-neutral-800">{user.email}</span>
                      </div>
                    </div>

                    {/* Read Phone */}
                    <div className="flex items-center space-x-3.5 py-2.5 border-b border-neutral-50">
                      <Phone size={15} className="text-neutral-400 shrink-0" />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-semibold">
                          Số Điện Thoại
                        </span>
                        <span className="text-xs font-semibold text-neutral-800">{user.phone}</span>
                      </div>
                    </div>

                    {/* Read Address */}
                    <div className="flex items-start space-x-3.5 py-2.5 border-b border-neutral-50">
                      <MapPin size={15} className="text-neutral-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 block font-semibold">
                          Địa chỉ Mặc Định
                        </span>
                        <span className="text-xs font-semibold text-neutral-800 break-words leading-relaxed">
                          {user.address || <em className="text-neutral-400 font-normal">Chưa cập nhật địa chỉ giao hàng</em>}
                        </span>
                      </div>
                    </div>

                    {/* Edit Profile trigger action button */}
                    <button
                      onClick={handleEditToggle}
                      className="w-full flex items-center justify-center gap-1.5 border border-neutral-250 text-neutral-800 hover:border-neutral-950 hover:text-neutral-950 py-3 text-xs uppercase tracking-widest font-bold font-sans transition-colors mt-4"
                    >
                      <Edit2 size={12} />
                      <span>Sửa Thông Tin Tài Khoản</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Logout button */}
              <button
                onClick={() => {
                  logoutUser();
                  navigate('/');
                }}
                className="w-full text-center hover:underline text-xs tracking-wider text-red-500 font-bold hover:text-red-600 transition"
              >
                Đăng xuất tài khoản
              </button>

            </div>
          </div>

          {/* Right Panel: Order History dashboard list */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-neutral-100 p-6 md:p-8 shadow-sm rounded-sm space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h4 className="font-sans text-sm font-semibold text-neutral-900 uppercase tracking-widest flex items-center gap-2">
                  <ShoppingBag size={16} /> Lịch Sử Mua Hàng ({orders.length})
                </h4>
                <Link to="/shop" className="text-xs text-neutral-500 hover:text-neutral-950 hover:underline">
                  Mua sắm thêm
                </Link>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((ord) => {
                    const status = statusLabels[ord.status] || { label: ord.status, color: '', bg: '' };
                    return (
                      <div
                        key={ord.orderId}
                        className="border border-neutral-200 bg-[#FAF9F6]/30 p-5 rounded-sm relative overflow-hidden space-y-4 shadow-sm"
                      >
                        {/* Order Header info */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-3">
                          <div className="flex items-center space-x-4">
                            <span className="text-xs font-bold text-neutral-900">{ord.orderId}</span>
                            <span className="text-neutral-300">|</span>
                            <span className="text-neutral-500 text-[11px] flex items-center gap-1">
                              <Calendar size={12} /> {new Date(ord.date).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`text-[10px] font-bold uppercase py-1 px-2.5 border rounded-none ${status.color} ${status.bg}`}>
                            {status.label}
                          </span>
                        </div>

                        {/* Order Content list items included */}
                        <div className="space-y-2">
                          {ord.items.map((it: any, i: number) => (
                            <div key={i} className="flex justify-between items-center text-xs">
                              <span className="text-neutral-600 font-medium">
                                {it.name} <strong className="text-neutral-400">x {it.quantity}</strong>
                              </span>
                              <span className="font-semibold text-neutral-800">
                                {it.price ? (it.price * it.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer summary info detail */}
                        <div className="flex flex-wrap items-center justify-between border-t border-neutral-150 pt-3 gap-3 text-xs">
                          <div className="space-y-1">
                            <span className="text-neutral-450 uppercase tracking-wider text-[10px] block">
                              Thanh toán: <strong className="text-neutral-800 font-semibold">{ord.paymentMethod}</strong>
                            </span>
                            <span className="font-extrabold text-neutral-950 font-sans text-sm block">
                              Tổng cộng: {ord.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedOrderForModal(ord)}
                            className="bg-neutral-950 hover:bg-neutral-800 text-white text-[11px] font-bold uppercase tracking-wider py-2 px-4 rounded-none flex items-center gap-1.5 shadow-sm transition-all"
                          >
                            <Eye size={13} />
                            <span>Xem chi tiết & Theo dõi</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <Bookmark className="text-neutral-300 mx-auto" size={32} />
                  <h5 className="text-neutral-800 font-medium text-sm">Chưa có đơn hàng nào được tạo</h5>
                  <p className="text-neutral-450 text-xs max-w-xs mx-auto leading-relaxed">
                    Nàng chưa tiến hành đặt mua vật phẩm nào từ tủ đồ sưu tập. Hãy chọn cho mình những bộ cánh tiên phong quyến rũ ngay.
                  </p>
                  <Link
                    to="/shop"
                    className="bg-neutral-950 text-white uppercase tracking-widest text-[11px] font-bold py-3.5 px-6 inline-block rounded-none shadow-sm"
                  >
                    Mở Catalog Để Mua Sắm
                  </Link>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Order Tracking Modal Overlay */}
      <AnimatePresence>
        {selectedOrderForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-neutral-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl rounded-sm p-6 sm:p-8 space-y-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                    ORDER TRACKING
                  </span>
                  <h3 className="text-lg font-bold text-neutral-900 font-sans flex items-center gap-2">
                    Mã đơn hàng: {selectedOrderForModal.orderId}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedOrderForModal(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-950 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Order Status Timeline Bar */}
              <div className="bg-neutral-50 p-6 border border-neutral-100 rounded-sm space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-1.5">
                  <Truck size={15} className="text-[#c9a96e]" /> Tiến Trình Vận Chuyển Đơn Hàng
                </h4>

                {/* Timeline visual steps */}
                {selectedOrderForModal.status === 'canceled' ? (
                  <div className="bg-red-50 border border-red-100 p-4 text-center rounded-sm">
                    <p className="text-xs font-semibold text-red-600">
                      Đơn hàng đã bị hủy. Vui lòng liên hệ bộ phận CSKH nếu bạn cần hỗ trợ thêm.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 pt-2 relative">
                    {[
                      { step: 1, key: 'processing', label: 'Đặt hàng', icon: ShoppingBag },
                      { step: 2, key: 'processing', label: 'Xử lý kho', icon: Package },
                      { step: 3, key: 'shipping', label: 'Đang vận chuyển', icon: Truck },
                      { step: 4, key: 'delivered', label: 'Hoàn thành', icon: CheckCircle2 },
                    ].map((st, idx) => {
                      const currentStatus = selectedOrderForModal.status; // processing, shipping, delivered
                      const isCompleted =
                        currentStatus === 'delivered' ||
                        (currentStatus === 'shipping' && idx <= 2) ||
                        (currentStatus === 'processing' && idx <= 1);

                      const isCurrent =
                        (currentStatus === 'processing' && idx === 1) ||
                        (currentStatus === 'shipping' && idx === 2) ||
                        (currentStatus === 'delivered' && idx === 3);

                      const Icon = st.icon;

                      return (
                        <div key={idx} className="flex flex-col items-center text-center space-y-2">
                          <div
                            className={`h-9 w-9 rounded-full flex items-center justify-center border transition-all ${
                              isCompleted
                                ? 'bg-neutral-900 border-neutral-900 text-white'
                                : 'bg-white border-neutral-200 text-neutral-300'
                            } ${isCurrent ? 'ring-4 ring-neutral-200 font-bold' : ''}`}
                          >
                            <Icon size={16} />
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider ${
                              isCompleted ? 'text-neutral-900' : 'text-neutral-400'
                            }`}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Order Info & Address Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white border border-neutral-100 p-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Thông tin người nhận
                  </span>
                  <p className="font-semibold text-neutral-800">{user.fullName}</p>
                  <p className="text-neutral-600">{user.phone}</p>
                  <p className="text-neutral-500 text-[11px] leading-relaxed">{user.address || 'Chưa có địa chỉ'}</p>
                </div>
                <div className="space-y-1 sm:border-l sm:border-neutral-100 sm:pl-4">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Thông tin thanh toán
                  </span>
                  <p className="text-neutral-600">Phương thức: <strong className="text-neutral-900">{selectedOrderForModal.paymentMethod}</strong></p>
                  <p className="text-neutral-600">Ngày đặt: <strong className="text-neutral-900">{new Date(selectedOrderForModal.date).toLocaleDateString('vi-VN')}</strong></p>
                  <p className="text-neutral-600">Trạng thái: <strong className="text-emerald-700 font-bold uppercase">{selectedOrderForModal.status}</strong></p>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Danh mục sản phẩm trong đơn ({selectedOrderForModal.items.length})
                </h4>
                <div className="border border-neutral-100 divide-y divide-neutral-100">
                  {selectedOrderForModal.items.map((item: any, i: number) => (
                    <div key={i} className="p-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-neutral-900 block">{item.name}</span>
                        <span className="text-[10px] text-neutral-400">Số lượng: {item.quantity}</span>
                      </div>
                      <span className="font-bold text-neutral-900">
                        {item.price ? (item.price * item.quantity).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer Total */}
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                  Tổng thanh toán đơn hàng
                </span>
                <span className="text-lg font-bold text-neutral-950 font-sans">
                  {selectedOrderForModal.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                </span>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedOrderForModal(null)}
                  className="bg-neutral-950 text-white text-xs font-bold uppercase tracking-widest py-3 px-6 hover:bg-neutral-800 transition-colors"
                >
                  Đóng Cửa Sổ
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
