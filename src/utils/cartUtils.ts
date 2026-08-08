import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export const getLocalCart = (): CartItem[] => {
  try {
    const data = localStorage.getItem('fashion_aura_cart');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
};

export const saveLocalCart = (cart: CartItem[]): void => {
  try {
    localStorage.setItem('fashion_aura_cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart to localStorage', e);
  }
};

export const getCartTotal = (cart: CartItem[]): number => {
  return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
};

export const getCartCount = (cart: CartItem[]): number => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
