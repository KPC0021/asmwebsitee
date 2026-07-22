import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, LogIn, Sparkles, AlertCircle } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validation';
import { useCartAndAuth } from '../context/CartAndAuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser, user, showToast } = useCartAndAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [generalError, setGeneralError] = useState('');

  // Protect already logged in users from visiting login
  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    const newErrors: typeof errors = {};

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    const passwordErr = validatePassword(password);
    if (passwordErr) newErrors.password = passwordErr;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Now check registered user in simulated DB
    try {
      const regUsersStr = localStorage.getItem('fashion_aura_reg_users');
      const regUsers = regUsersStr ? JSON.parse(regUsersStr) : [];

      // Add a quick default account if no accounts exist
      const defaultUser = {
        fullName: "Khanh Pham Aura",
        email: "demo@aura.com",
        phone: "0901234567",
        address: "88 Đồng Khởi, Quận 1, TP Hồ Chí Minh",
        password: "123456"
      };

      const allUsers = [...regUsers];
      if (!allUsers.find(u => u.email === defaultUser.email)) {
        allUsers.push(defaultUser);
        localStorage.setItem('fashion_aura_reg_users', JSON.stringify(allUsers));
      }

      const matchUser = allUsers.find(u => u.email === email);

      if (matchUser) {
        if (matchUser.password === password) {
          loginUser({
            fullName: matchUser.fullName,
            email: matchUser.email,
            phone: matchUser.phone,
            address: matchUser.address || "Chưa cập nhật địa chỉ",
          });
          navigate('/profile');
        } else {
          setGeneralError("Mật khẩu không chính xác. Vui lòng kiểm tra lại.");
        }
      } else {
        setGeneralError("Tài khoản email này chưa được đăng ký trong hệ thống.");
      }
    } catch (err) {
      console.error(err);
      setGeneralError("Lỗi hệ thống lưu trữ tài khoản.");
    }
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
          <span className="font-sans text-xs tracking-[0.25em] font-semibold text-neutral-400 uppercase">
            SIGN IN AUDIT
          </span>
          <h2 className="text-2xl font-sans font-medium text-neutral-900 tracking-tight">
            Chào mừng trở lại!
          </h2>
          <div className="h-[1px] w-8 bg-neutral-950 mx-auto mt-2.5"></div>
        </div>

        {/* General Alert */}
        {generalError && (
          <div className="bg-red-50 text-red-600 text-xs p-3 flex items-center space-x-2 border border-red-100 rounded-sm">
            <AlertCircle size={15} className="shrink-0" />
            <span>{generalError}</span>
          </div>
        )}

        {/* Main form schema */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          
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

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Mật Khẩu
              </label>
              <Link to="/forgot-password" className="text-[10px] text-neutral-400 hover:text-neutral-900 transition-colors">
                Quên mật khẩu?
              </Link>
            </div>
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

          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-neutral-950 hover:bg-neutral-850 text-white uppercase tracking-widest text-xs font-bold w-full py-4 rounded-none flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <LogIn size={14} />
              <span>Đăng Nhập Ngay</span>
            </button>
          </div>

        </form>

        {/* Navigation prompt to sign up */}
        <div className="border-t border-neutral-100 pt-5 text-center text-xs text-neutral-500">
          Chưa có tài khoản thành viên?{' '}
          <Link to="/register" className="text-neutral-900 font-bold hover:underline">
            Đăng ký tài khoản
          </Link>
        </div>

      </motion.div>
    </div>
  );
};
