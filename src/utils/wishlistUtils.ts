import { getStorageOwner } from './cartUtils';

const LEGACY_WISHLIST_KEY = 'fashion_aura_wishlist';

export const getWishlistStorageKey = (userEmail?: string | null): string =>
  `fashion_aura_wishlist:${getStorageOwner(userEmail)}`;

export const getLocalWishlist = (userEmail?: string | null): string[] => {
  try {
    const storedWishlist = localStorage.getItem(getWishlistStorageKey(userEmail));
    const parsed = storedWishlist ? JSON.parse(storedWishlist) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading wishlist from localStorage', e);
    return [];
  }
};

export const saveLocalWishlist = (
  wishlist: string[],
  userEmail?: string | null
): void => {
  try {
    localStorage.setItem(getWishlistStorageKey(userEmail), JSON.stringify(wishlist));
  } catch (e) {
    console.error('Error saving wishlist to localStorage', e);
  }
};

export const migrateLegacyWishlist = (userEmail?: string | null): void => {
  try {
    const legacyWishlist = localStorage.getItem(LEGACY_WISHLIST_KEY);
    if (!legacyWishlist) return;

    const targetKey = getWishlistStorageKey(userEmail);
    if (localStorage.getItem(targetKey) === null) {
      localStorage.setItem(targetKey, legacyWishlist);
    }
    localStorage.removeItem(LEGACY_WISHLIST_KEY);
  } catch (e) {
    console.error('Error migrating wishlist in localStorage', e);
  }
};
