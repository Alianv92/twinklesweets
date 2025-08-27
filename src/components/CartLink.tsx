"use client";

import Link from "next/link";
import { useCart } from "../lib/cart";

export default function CartLink() {
  const { items } = useCart();
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <Link href="/cart" className="hover:opacity-80 relative">
      Cart
      {count > 0 && (
        <span className="ml-1 rounded-full bg-[var(--gold)] text-xs px-2 py-0.5">
          {count}
        </span>
      )}
    </Link>
  );
}