import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, ArrowLeft, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { validateEmail } from '../utils/validation';
import { useCartAndAuth } from '../context/CartAndAuthContext';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useCartAndAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setIsLoading(true);

    // Simulate mock email sending delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      showToast('Đã gửi liên kết đặt lại mật khẩu tới email của bạn!', 'success');
    }, 1200);
  };

  return (
    <div className="bg-[#FAF9F6] min-h-[80vh] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white border border-neutral-100 p-8 shadow-xl rounded-sm space-y-6"
      >
        {/* Brand header */}
        <div className="text-center space-y-2">
          <span className="font-sans text-[10px] tracking-[0.25em] font-semibold text-neutral-400 uppercase">
            ACCOUNT RECOVERY
          </span>
          <h2 className="text-2xl font-sans font-medium text-neutral-900 tracking-tight">
            Quên Mật Khẩu?
          </h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed pt-1">
            Nhập địa chỉ email đăng ký tài khoản của bạn để nhận hướng dẫn khôi phục mật khẩu.
          </p>
          <div className="h-[1px] w-8 bg-neutral-950 mx-auto mt-2.5"></div>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-50/60 border border-emerald-100 p-6 text-center space-y-4 rounded-sm"
          >
            <div className="h-12 w-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-emerald-900">Đã gửi yêu cầu thành công!</h3>
              <p className="text-xs text-emerald-700 leading-relaxed">
                Chúng tôi đã gửi đường dẫn đặt lại mật khẩu đến email <strong className="font-bold">{email}</strong>. Vui lòng kiểm tra hộp thư (bao gồm cả thư rác).
              </p>
            </div>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-[11px] text-emerald-800 underline font-semibold hover:text-emerald-950"
            >
              Gửi lại bằng email khác
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Địa chỉ Email
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ten_ban@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                    error ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                  } focus:outline-none rounded-none`}
                />
                <Mail className="absolute left-3.5 top-3.5 text-neutral-400" size={14} />
              </div>
              {error && (
                <p className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                  <AlertCircle size={12} /> {error}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-neutral-950 hover:bg-neutral-850 text-white uppercase tracking-widest text-xs font-bold w-full py-4 rounded-none flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="animate-pulse">Đang xử lý...</span>
                ) : (
                  <>
                    <Send size={14} />
                    <span>Gửi Yêu Cầu Khôi Phục</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Navigation back to login */}
        <div className="border-t border-neutral-100 pt-5 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-950 font-bold transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Quay lại trang Đăng Nhập</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
