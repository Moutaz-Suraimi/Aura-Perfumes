import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

interface CartItem {
  product: Product;
  qty: number;
}
interface CartCtx {
  items: CartItem[];
  count: number;
  total: number;
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}
const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("hg_cart");
      if (raw) setItems(JSON.parse(raw));
    } catch (err) {
      console.warn("Failed to load cart from local storage", err);
    }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("hg_cart", JSON.stringify(items));
    } catch (err) {
      console.warn("Failed to save cart to local storage", err);
    }
  }, [items]);

  const add = (p: Product, qty = 1) =>
    setItems((prev) => {
      const i = prev.findIndex((x) => x.product.id === p.id);
      if (i >= 0) {
        const c = [...prev];
        c[i] = { ...c[i], qty: c[i].qty + qty };
        return c;
      }
      return [...prev, { product: p, qty }];
    });
  const remove = (id: string) => setItems((prev) => prev.filter((x) => x.product.id !== id));
  const setQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((x) => (x.product.id === id ? { ...x, qty: Math.max(1, qty) } : x)),
    );
  const clear = () => setItems([]);
  const count = items.reduce((s, x) => s + x.qty, 0);
  const total = items.reduce((s, x) => s + x.qty * x.product.price, 0);
  return (
    <Ctx.Provider value={{ items, count, total, add, remove, setQty, clear }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

export const fmt = (n: number) =>
  n
    .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .replace(/,/g, ".");
