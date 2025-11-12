import React, { createContext, useContext, useMemo, useState } from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  totalItems: number; // sum of qty
  subtotal: number; // sum of price * qty
};

const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function add(item: Omit<CartItem, "qty">, qty: number = 1) {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.id === item.id);
      if (i >= 0) {
        const copy = [...prev];
        copy[i] = { ...copy[i], qty: copy[i].qty + qty };
        return copy;
      }
      return [...prev, { ...item, qty }];
    });
  }

  function setQty(id: number, qty: number) {
    setItems((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty } : p))
        .filter((p) => p.qty > 0)
    );
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function clear() {
    setItems([]);
  }

  const totalItems = useMemo(
    () => items.reduce((sum, p) => sum + p.qty, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, p) => sum + p.qty * p.price, 0),
    [items]
  );

  const value = { items, add, setQty, remove, clear, totalItems, subtotal };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
