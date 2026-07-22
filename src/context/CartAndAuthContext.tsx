import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, getLocalCart, saveLocalCart } from '../utils/cartUtils';
import { Product } from '../data/products';

export interface User {
  fullName: string;
  email: string;
  phone: string;
  address?: string;
  password?: string;
}

interface CartAndAuthContextType {
  cart: CartItem[];
  user: User | null;
  wishlist: string[];
  addToCart: (product: Product, size: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loginUser: (user: User) => void;
  registerUser: (user: User) => void;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  logoutUser: () => void;
  toast: { message: string; type: 'success' | 'error' | 'info' | null };
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CartAndAuthContext = createContext<CartAndAuthContextType | undefined>(undefined);

export const CartAndAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | null }>({
    message: '',
    type: null,
  });

  // Initial load
  useEffect(() => {
    // Cart
    setCart(getLocalCart());

    // Wishlist
    try {
      const storedWishlist = localStorage.getItem('fashion_aura_wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (e) {
      console.error(e);
    }

    // User
    try {
      const storedActive = localStorage.getItem('fashion_aura_active_user');
      if (storedActive) {
        setUser(JSON.parse(storedActive));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    try {
      localStorage.setItem('fashion_aura_wishlist', JSON.stringify(newWishlist));
    } catch (e) {
      console.error(e);
    }
  };

  const addToWishlist = (productId: string) => {
    if (!wishlist.includes(productId)) {
      const newWishlist = [...wishlist, productId];
      saveWishlist(newWishlist);
      showToast('Đã thêm sản phẩm vào danh sách yêu thích!', 'success');
    }
  };

  const removeFromWishlist = (productId: string) => {
    const newWishlist = wishlist.filter((id) => id !== productId);
    saveWishlist(newWishlist);
    showToast('Đã xóa sản phẩm khỏi danh sách yêu thích.', 'info');
  };

  const toggleWishlist = (productId: string) => {
    if (wishlist.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast({ message: '', type: null });
    }, 3000);
  };

  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      let newCart;
      if (existingIndex > -1) {
        newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
      } else {
        newCart = [...prevCart, { product, selectedSize: size, quantity }];
      }
      saveLocalCart(newCart);
      return newCart;
    });
    showToast(`Đã thêm ${quantity} x ${product.name} (Size ${size}) vào giỏ hàng`);
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prevCart) => {
      const newCart = prevCart.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      );
      saveLocalCart(newCart);
      return newCart;
    });
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prevCart) => {
      const newCart = prevCart.map((item) => {
        if (item.product.id === productId && item.selectedSize === size) {
          return { ...item, quantity };
        }
        return item;
      });
      saveLocalCart(newCart);
      return newCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    saveLocalCart([]);
  };

  const loginUser = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('fashion_aura_active_user', JSON.stringify(loggedInUser));
    showToast(`Chào mừng quay trở lại, ${loggedInUser.fullName}!`);
  };

  const registerUser = (newUser: User) => {
    // Save to users database list in localStorage to support profile/login persistence
    try {
      const registeredUsersStr = localStorage.getItem('fashion_aura_reg_users');
      const registeredUsers = registeredUsersStr ? JSON.parse(registeredUsersStr) : [];
      
      // Filter out duplicates
      const updatedUsers = [...registeredUsers.filter((u: any) => u.email !== newUser.email), newUser];
      localStorage.setItem('fashion_aura_reg_users', JSON.stringify(updatedUsers));
      
      // Automatically log inside user
      setUser(newUser);
      localStorage.setItem('fashion_aura_active_user', JSON.stringify(newUser));
      showToast(`Đăng ký thành công! Chào mừng ${newUser.fullName}.`);
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserProfile = (updatedUser: Partial<User>) => {
    if (!user) return;
    const finalUser = { ...user, ...updatedUser };
    setUser(finalUser);
    localStorage.setItem('fashion_aura_active_user', JSON.stringify(finalUser));

    // Update the record in the users database list too
    try {
      const registeredUsersStr = localStorage.getItem('fashion_aura_reg_users');
      if (registeredUsersStr) {
        const registeredUsers = JSON.parse(registeredUsersStr);
        const index = registeredUsers.findIndex((u: any) => u.email === finalUser.email);
        if (index > -1) {
          registeredUsers[index] = { ...registeredUsers[index], ...updatedUser };
          localStorage.setItem('fashion_aura_reg_users', JSON.stringify(registeredUsers));
        }
      }
    } catch (e) {
      console.error(e);
    }
    showToast('Cập nhật hồ sơ tài khoản thành công!');
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('fashion_aura_active_user');
    showToast('Bạn đã đăng xuất tài khoản.', 'info');
  };

  return (
    <CartAndAuthContext.Provider
      value={{
        cart,
        user,
        wishlist,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        loginUser,
        registerUser,
        updateUserProfile,
        logoutUser,
        toast,
        showToast,
      }}
    >
      {children}
    </CartAndAuthContext.Provider>
  );
};

export const useCartAndAuth = () => {
  const context = useContext(CartAndAuthContext);
  if (context === undefined) {
    throw new Error('useCartAndAuth must be used within a CartAndAuthProvider');
  }
  return context;
};
