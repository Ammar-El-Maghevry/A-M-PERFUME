'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  add: (productId: number, quantity?: number) => void;
  remove: (productId: number) => void;
  updateQty: (productId: number, quantity: number) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      updateQty: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: 'am-cart' },
  ),
);
