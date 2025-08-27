"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { PRODUCTS } from "./products";

// Cart item type includes product metadata
export type CartItem = {
  id: string;
  name: string;
  price: number; // in cents
  qty: number;
};

type CartContextType = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = (id: string, qty = 1) => {
    const product = PRODUCTS.find((p) => p.id === id);
    if (!product) return;

    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        { id, name: product.name, price: product.price, qty },
      ];
    });
  };

  const remove = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );

  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, remove, setQty, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}