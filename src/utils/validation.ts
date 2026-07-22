export const validateEmail = (email: string): string | null => {
  if (!email) return "Email không được bỏ trống.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Email phải đúng định dạng.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Mật khẩu không được bỏ trống.";
  if (password.length < 6) return "Mật khẩu tối thiểu phải từ 6 ký tự trở lên.";
  return null;
};

export const validateFullName = (name: string): string | null => {
  if (!name || name.trim() === "") return "Họ và tên không được bỏ trống.";
  return null;
};

export const validatePhone = (phone: string): string | null => {
  if (!phone || phone.trim() === "") return "Số điện thoại không được bỏ trống.";
  const phoneRegex = /^[0-9+ ]{9,12}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ""))) return "Số điện thoại không hợp lệ (9 - 12 chữ số).";
  return null;
};

export const validateConfirmPassword = (password: string, confirm: string): string | null => {
  if (!confirm) return "Vui lòng xác nhận mật khẩu.";
  if (password !== confirm) return "Mật khẩu xác nhận không trùng khớp.";
  return null;
};

export const validateAddress = (address: string): string | null => {
  if (!address || address.trim() === "") return "Địa chỉ nhận hàng không được bỏ trống.";
  return null;
};
