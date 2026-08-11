import type { Product } from '../data/products';

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

const LEGACY_CART_KEY = 'fashion_aura_cart';

export const getStorageOwner = (userEmail?: string | null): string => {
  const normalizedEmail = userEmail?.trim().toLowerCase();
  return normalizedEmail ? encodeURIComponent(normalizedEmail) : 'guest';
};

export const getCartStorageKey = (userEmail?: string | null): string =>
  `fashion_aura_cart:${getStorageOwner(userEmail)}`;

export const migrateLegacyCart = (userEmail?: string | null): void => {
  try {
    const legacyCart = localStorage.getItem(LEGACY_CART_KEY);
    if (!legacyCart) return;

    const targetKey = getCartStorageKey(userEmail);
    if (localStorage.getItem(targetKey) === null) {
      localStorage.setItem(targetKey, legacyCart);
    }
    localStorage.removeItem(LEGACY_CART_KEY);
  } catch (e) {
    console.error('Error migrating cart in localStorage', e);
  }
};

export const getLocalCart = (userEmail?: string | null): CartItem[] => {
  try {
    const data = localStorage.getItem(getCartStorageKey(userEmail));
    const parsed = data ? JSON.parse(data) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading cart from localStorage', e);
    return [];
  }
};

export const saveLocalCart = (cart: CartItem[], userEmail?: string | null): void => {
  try {
    localStorage.setItem(getCartStorageKey(userEmail), JSON.stringify(cart));
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
