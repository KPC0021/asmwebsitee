import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { User, Mail, Phone, Lock, UserPlus, CheckSquare } from 'lucide-react';
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
  validatePhone,
} from '../utils/validation';
import { useCartAndAuth } from '../context/CartAndAuthContext';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser, user, showToast } = useCartAndAuth();

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Checking terms checkbox state
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Errors state
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [registerSuccess, setRegisterSuccess] = useState(false);

  // If user is already active, redirect to profile
  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    const nameErr = validateFullName(fullName);
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const phoneErr = validatePhone(phone);
    if (phoneErr) newErrors.phone = phoneErr;

    const passErr = validatePassword(password);
    if (passErr) newErrors.password = passErr;

    const confErr = validateConfirmPassword(password, confirmPassword);
    if (confErr) newErrors.confirmPassword = confErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('Vui lòng kiểm tra lại thông tin đăng ký.', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('Bạn cần đồng ý với Điều khoản dịch vụ của Aura để tiếp tục.', 'error');
      return;
    }

    // Call Context action to register & login user
    registerUser({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password, // for mock logins
      address: '', // empty originally
    });

    setRegisterSuccess(true);
    navigate('/profile');
  };

  return (
    <div className="bg-[#FAF9F6] min-h-[90vh] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg bg-white border border-neutral-100 p-8 shadow-xl rounded-sm space-y-6"
      >
        {/* Header brand */}
        <div className="text-center space-y-2">
          <span className="font-sans text-xs tracking-[0.25em] font-semibold text-neutral-400">
            JOIN ATELIER MEMBERSHIP
          </span>
          <h2 className="text-2xl font-sans font-medium text-neutral-900 tracking-tight">
            Đăng Ký Thành Viên
          </h2>
          <div className="h-[1px] w-8 bg-neutral-950 mx-auto mt-2.5"></div>
        </div>

        {/* Main form schema */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          
          {/* Full name input */}
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
              Họ và Tên *
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                className={`w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                  errors.fullName ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                } focus:outline-none rounded-none`}
              />
              <User className="absolute left-3.5 top-3.5 text-neutral-400" size={14} />
            </div>
            {errors.fullName && <p className="text-[10px] text-red-500 font-medium">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Email input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Địa chỉ Email *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ten_ban@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors((prev) => ({ ...prev, email: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                    errors.email ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                  } focus:outline-none rounded-none`}
                />
                <Mail className="absolute left-3.5 top-3.5 text-neutral-400" size={14} />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>}
            </div>

            {/* Phone input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Số Điện Thoại *
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="09xxxxxxxx"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors((prev) => ({ ...prev, phone: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                    errors.phone ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                  } focus:outline-none rounded-none`}
                />
                <Phone className="absolute left-3.5 top-3.5 text-neutral-400" size={14} />
              </div>
              {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone}</p>}
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Password input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Mật Khẩu *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, password: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                    errors.password ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                  } focus:outline-none rounded-none`}
                />
                <Lock className="absolute left-3.5 top-3.5 text-neutral-400" size={14} />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-medium">{errors.password}</p>}
            </div>

            {/* Confirm password input */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Xác Nhận Mật Khẩu *
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 text-xs text-neutral-800 bg-neutral-50/50 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-neutral-200 focus:border-neutral-950 focus:bg-white'
                  } focus:outline-none rounded-none`}
                />
                <Lock className="absolute left-3.5 top-3.5 text-neutral-400" size={14} />
              </div>
              {errors.confirmPassword && (
                <p className="text-[10px] text-red-500 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

          </div>

          {/* Agree T&C checkbox */}
          <div className="pt-2">
            <label className="flex items-start space-x-2.5 text-[11px] text-neutral-500 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded-none border-neutral-300 text-neutral-950 focus:ring-0 h-3.5 w-3.5 cursor-pointer"
              />
              <span>
                Tôi đồng ý với <strong>Điều khoản sử dụng</strong> và{' '}
                <strong>Chính sách Bảo mật & Chăm sóc Khách hàng</strong> của Fashion Aura.
              </span>
            </label>
          </div>

          {/* Submit register button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-neutral-950 hover:bg-neutral-850 text-white uppercase tracking-widest text-xs font-bold w-full py-4 rounded-none flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <UserPlus size={14} />
              <span>Đăng Ký Thành Viên</span>
            </button>
          </div>

        </form>

        {/* Foot sign up transition */}
        <div className="border-t border-neutral-100 pt-5 text-center text-xs text-neutral-500">
          Đã đăng ký tài khoản trước đó?{' '}
          <Link to="/login" className="text-neutral-900 font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </div>

      </motion.div>
    </div>
  );
};
