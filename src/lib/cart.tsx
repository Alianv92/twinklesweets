"use client";

import { createContext, useContext, useState } from "react";

type CartItem = { id: string; qty: number };
type CartContextType = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (id: string, qty = 1) =>
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      return existing
        ? prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i))
        : [...prev, { id, qty }];
    });

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i)),
    );

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}