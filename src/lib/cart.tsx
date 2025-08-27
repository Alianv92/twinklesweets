// src/lib/cart.tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { PRODUCTS } from "./products";

export type CartItem = {
  id: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  add: (id: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function readInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("cart:v1");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      // basic validation
      return parsed
        .filter(
          (x) =>
            x &&
            typeof x === "object" &&
            typeof (x as any).id === "string" &&
            typeof (x as any).qty === "number"
        )
        .map((x) => ({ id: (x as any).id, qty: (x as any).qty }));
    }
    return [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => readInitialCart());

  // Persist to localStorage — use explicit `if` to satisfy ESLint.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cart:v1", JSON.stringify(items));
    }
  }, [items]);

  const add = useCallback((id: string, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { id, qty }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({ items, add, remove, setQty, clear }),
    [items, add, remove, setQty, clear]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// Helper to compute a display-ready line list in Cart pages (optional)
export function getCartLines(items: CartItem[]) {
  return items
    .map((line) => {
      const product = PRODUCTS.find((p) => p.id === line.id);
      if (!product) return null;
      return {
        id: line.id,
        name: product.name,
        qty: line.qty,
        price: product.price, // cents
        image: product.image,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));
}