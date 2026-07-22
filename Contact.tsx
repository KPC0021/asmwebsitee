import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { SectionTitle } from '../components/SectionTitle';
import { validateEmail, validateFullName, validatePhone } from '../utils/validation';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors instantly upon editing
    if (errors[name as keyof typeof formData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<typeof formData> = {};

    const nameError = validateFullName(formData.fullName);
    if (nameError) newErrors.fullName = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    if (!formData.message.trim()) {
      newErrors.message = 'Nội dung tin nhắn không được bỏ trống.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Success submission
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset Form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="bg-[#FAF9F6] py-12 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <SectionTitle
          title="Contact With Us"
          subtitle="Liên hệ đội ngũ CSKH"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          
          {/* Left: Contact Info Detail Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-neutral-100 p-8 shadow-sm rounded-sm space-y-6">
              <h3 className="text-lg font-sans font-semibold text-neutral-900 tracking-tight">
                Fashion Aura Atelier
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Quý khách có bất cứ câu hỏi nào về sản phẩm, kích cỡ chính xác hay quy trình hoàn trả? Vui lòng gửi liên hệ trực tiếp, chúng tôi sẽ nhiệt tình giải đáp trong vòng 2 giờ làm việc.
              </p>

              <div className="space-y-4 pt-4 border-t border-neutral-100">
                {/* Item 1 */}
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 text-neutral-900 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-800">Cửa hàng trung tâm</h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                      88 Đồng Khởi, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 text-neutral-900 shrink-0">
                    <Phone size={16} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-800">Đường dây nóng hỗ trợ</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">+84 (0) 90 123 4567</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Thời gian nhận cuộc gọi: 09:00 - 18:00 (T2 - CN)</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 text-neutral-900 shrink-0">
                    <Mail size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-800">Hòm thư điện tử</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">cskh@fashionaura.vn</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">Phục vụ phản hồi 24/7</p>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="flex items-start space-x-4">
                  <div className="h-10 w-10 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100 text-neutral-900 shrink-0">
                    <Clock size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-800">Giờ làm việc văn phòng</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Thứ hai - Thứ bảy: 08:30 - 17:30</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated beautiful store map section card */}
            <div className="bg-neutral-900 text-white p-6 rounded-sm space-y-4 shadow-sm relative overflow-hidden h-40 flex flex-col justify-end">
              <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-amber-300">Showroom Atelier Map</h4>
              <p className="text-xs text-neutral-300 max-w-xs leading-relaxed z-10">
                Nằm kế bên khách sạn Continental Saigon lịch sử. Giao thương đắc địa bậc nhất Sài Thành có bố trí điểm đỗ ô tô riêng.
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase font-bold tracking-widest text-white underline hover:text-neutral-200 z-10"
              >
                Chỉ đường trên Google Maps
              </a>
            </div>
          </div>

          {/* Right: Message sending form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-neutral-100 p-8 shadow-sm rounded-sm">
              <h3 className="text-lg font-sans font-semibold text-neutral-900 tracking-tight mb-6">
                Gửi Tin Nhắn Nhanh Cho Aura
              </h3>

              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="inline-flex h-12 w-12 rounded-full bg-emerald-50 text-emerald-500 items-center justify-center">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-base font-semibold text-neutral-900">Gửi lời nhắn thành công!</h4>
                    <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                      Cảm ơn nàng đã gửi phản hồi. Aura đã tiếp nhận thông tin và sẽ gửi nội dung trả lời chi tiết tới hòm thư của nàng sớm nhất.
                    </p>
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-xs font-semibold text-neutral-900 uppercase border-b border-neutral-950 pb-1"
                    >
                      Gửi tin nhắn khác
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Họ và Tên *</label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Nguyễn Văn A"
                          className={`w-full px-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                            errors.fullName ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                          } focus:outline-none rounded-none`}
                        />
                        {errors.fullName && <p className="text-[10px] text-red-500">{errors.fullName}</p>}
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Số điện thoại *</label>
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="09xxx"
                          className={`w-full px-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                            errors.phone ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                          } focus:outline-none rounded-none`}
                        />
                        {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Địa chỉ Email *</label>
                      <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ten_ban@email.com"
                        className={`w-full px-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                          errors.email ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                        } focus:outline-none rounded-none`}
                      />
                      {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
                    </div>

                    {/* Subject input */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Chủ đề mong muốn</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Tư vấn size, Hợp tác, Đổi trả hàng..."
                        className="w-full px-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border border-neutral-200 focus:border-neutral-950 focus:bg-white focus:outline-none rounded-none"
                      />
                    </div>

                    {/* Message body input */}
                    <div className="space-y-1.5">
                      <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">Nội dung liên hệ *</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Nội dung cần hỗ trợ..."
                        className={`w-full px-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                          errors.message ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                        } focus:outline-none rounded-none resize-none`}
                      />
                      {errors.message && <p className="text-[10px] text-red-500">{errors.message}</p>}
                    </div>

                    {/* Submitting Buttons */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-neutral-950 hover:bg-neutral-850 text-white uppercase tracking-widest text-xs font-bold w-full py-4 rounded-none flex items-center justify-center gap-2 shadow-sm transition-all duration-200 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span>Đang gửi thư...</span>
                        ) : (
                          <>
                            <Send size={14} />
                            <span>Gửi Yêu Cầu Liên Hệ</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
