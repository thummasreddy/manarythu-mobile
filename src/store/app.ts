import { create } from "zustand";
import { api, mocksEnabled, type Cart, type Product } from "../api";

const CART_TOKEN_KEY = "manarythu.cartToken";

function newCartToken(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Persisted cart token lives in AsyncStorage; loaded lazily to avoid a hard
// dependency cycle with the store module.
async function loadCartToken(): Promise<string | null> {
  try {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    return await AsyncStorage.getItem(CART_TOKEN_KEY);
  } catch {
    return null;
  }
}

async function saveCartToken(token: string) {
  try {
    const AsyncStorage = (await import("@react-native-async-storage/async-storage")).default;
    await AsyncStorage.setItem(CART_TOKEN_KEY, token);
  } catch {
    /* best effort — a new token is generated next launch */
  }
}

interface AppState {
  pincode: string;
  onboarded: boolean;
  favorites: string[];
  /** Local basket used only when mocks are enabled (keyed by product id). */
  cart: Record<string, number>;
  /** Server cart keyed by X-Cart-Token; populated when mocks are disabled. */
  serverCart: Cart | null;
  cartToken: string | null;
  cartBusy: boolean;
  setLocation: (pincode: string) => void;
  toggleFavorite: (id: string) => void;
  addCart: (id: string) => void;
  updateCart: (id: string, qty: number) => void;
  ensureCartToken: () => Promise<string>;
  refreshCart: () => Promise<void>;
  addToCart: (product: Product, qty?: number) => Promise<void>;
  setCartItemQty: (itemId: string, qty: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  pincode: "500081",
  onboarded: false,
  favorites: ["p2"],
  cart: {},
  serverCart: null,
  cartToken: null,
  cartBusy: false,
  setLocation: (pincode) => set({ pincode, onboarded: true }),
  toggleFavorite: (id) => set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
  addCart: (id) => set((s) => ({ cart: { ...s.cart, [id]: (s.cart[id] ?? 0) + 1 } })),
  updateCart: (id, qty) => set((s) => { const cart = { ...s.cart }; if (qty <= 0) delete cart[id]; else cart[id] = qty; return { cart }; }),
  ensureCartToken: async () => {
    let token = get().cartToken ?? (await loadCartToken());
    if (!token) {
      token = newCartToken();
      void saveCartToken(token);
    }
    if (get().cartToken !== token) set({ cartToken: token });
    return token;
  },
  refreshCart: async () => {
    if (mocksEnabled) return;
    const token = await get().ensureCartToken();
    set({ cartBusy: true });
    try {
      set({ serverCart: await api.cart(token), cartBusy: false });
    } catch (e) {
      set({ cartBusy: false });
      throw e;
    }
  },
  addToCart: async (product, qty = 1) => {
    if (mocksEnabled) {
      get().addCart(product.id);
      return;
    }
    const token = await get().ensureCartToken();
    set({ cartBusy: true });
    try {
      set({ serverCart: await api.addCartItem(token, product.defaultVariant.id, qty), cartBusy: false });
    } catch (e) {
      set({ cartBusy: false });
      throw e;
    }
  },
  setCartItemQty: async (itemId, qty) => {
    const token = await get().ensureCartToken();
    set({ cartBusy: true });
    try {
      set({
        serverCart: qty <= 0
          ? await api.removeCartItem(token, itemId)
          : await api.updateCartItem(token, itemId, qty),
        cartBusy: false,
      });
    } catch (e) {
      set({ cartBusy: false });
      throw e;
    }
  },
}));
