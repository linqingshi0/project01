import { devtools } from 'zustand/middleware';
import create from 'zustand';
import dayjs from 'dayjs';
import { fetchJSON } from './api';

interface ToastMessage {
  id?: string;
  title: string;
  description?: string;
}

interface CartItem {
  productId: string;
  qty: number;
  product: any;
}

interface AppState {
  bootstrap: {
    initialized: boolean;
    init: () => void;
  };
  auth: {
    token: string | null;
    user: any | null;
    setUser: (user: any, token: string) => void;
    reset: () => void;
  };
  cart: {
    items: CartItem[];
    add: (product: any, qty?: number) => void;
    remove: (productId: string) => void;
    updateQty: (productId: string, qty: number) => void;
    clear: () => void;
  };
  recipes: {
    list: any[];
    fetchMine: () => Promise<void>;
  };
  toast: {
    messages: ToastMessage[];
    show: (message: ToastMessage) => void;
    dismiss: (id: string) => void;
  };
}

const useAppStore = create<AppState>()(
  devtools((set, get) => ({
    bootstrap: {
      initialized: false,
      init: () => {
        const token = localStorage.getItem('lighteats_token');
        const user = localStorage.getItem('lighteats_user');
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            token,
            user: user ? JSON.parse(user) : null
          },
          bootstrap: { ...state.bootstrap, initialized: true }
        }));
      }
    },
    auth: {
      token: null,
      user: null,
      setUser: (user, token) => {
        localStorage.setItem('lighteats_token', token);
        localStorage.setItem('lighteats_user', JSON.stringify(user));
        set((state) => ({
          ...state,
          auth: { ...state.auth, user, token }
        }));
      },
      reset: () => {
        localStorage.removeItem('lighteats_token');
        localStorage.removeItem('lighteats_user');
        set((state) => ({ ...state, auth: { ...state.auth, token: null, user: null } }));
      }
    },
    cart: {
      items: [],
      add: (product, qty = 1) => {
        set((state) => {
          const exists = state.cart.items.find((item) => item.productId === product._id);
          const items = exists
            ? state.cart.items.map((item) =>
                item.productId === product._id ? { ...item, qty: item.qty + qty } : item
              )
            : [...state.cart.items, { productId: product._id, qty, product }];
          fetchJSON('cart', {
            method: 'POST',
            data: { items: items.map(({ productId, qty }) => ({ productId, qty })) }
          }).catch(() => undefined);
          return { ...state, cart: { ...state.cart, items } };
        });
      },
      remove: (productId) => {
        set((state) => ({
          ...state,
          cart: {
            ...state.cart,
            items: state.cart.items.filter((item) => item.productId !== productId)
          }
        }));
        const items = get().cart.items;
        fetchJSON('cart', {
          method: 'POST',
          data: { items: items.map(({ productId: id, qty }) => ({ productId: id, qty })) }
        }).catch(() => undefined);
      },
      updateQty: (productId, qty) => {
        set((state) => ({
          ...state,
          cart: {
            ...state.cart,
            items: state.cart.items.map((item) =>
              item.productId === productId ? { ...item, qty } : item
            )
          }
        }));
        const items = get().cart.items.map((item) => ({ productId: item.productId, qty: item.qty }));
        fetchJSON('cart', { method: 'POST', data: { items } }).catch(() => undefined);
      },
      clear: () => {
        set((state) => ({ ...state, cart: { ...state.cart, items: [] } }));
        fetchJSON('cart', { method: 'POST', data: { items: [] } }).catch(() => undefined);
      }
    },
    recipes: {
      list: [],
      fetchMine: async () => {
        const data = await fetchJSON<any[]>('recipes/me');
        set((state) => ({ ...state, recipes: { ...state.recipes, list: data } }));
      }
    },
    toast: {
      messages: [],
      show: (message) => {
        const id = message.id || `${Date.now()}`;
        set((state) => ({
          ...state,
          toast: {
            ...state.toast,
            messages: [...state.toast.messages, { ...message, id }]
          }
        }));
        setTimeout(() => get().toast.dismiss(id), 3500);
      },
      dismiss: (id) => {
        set((state) => ({
          ...state,
          toast: {
            ...state.toast,
            messages: state.toast.messages.filter((msg) => msg.id !== id)
          }
        }));
      }
    }
  }))
);

export default useAppStore;

export function getWeekdayLabel(date: string) {
  const day = dayjs(date);
  const weekMap = ['日', '一', '二', '三', '四', '五', '六'];
  return `${day.format('MM/DD')} 周${weekMap[day.day()]}`;
}
