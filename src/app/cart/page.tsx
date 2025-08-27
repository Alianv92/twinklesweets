"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../lib/cart";
import { PRODUCTS } from "../../lib/products";

export default function CartPage() {
  const cart = useCart();

  const items = cart.items.map((i) => {
    const p = PRODUCTS.find((p) => p.id === i.id)!;
    return { ...p, qty: i.qty, lineTotal: p.price * i.qty };
  });

  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Link href="/#products" className="inline-block mt-6 rounded-xl bg-[var(--gold)] px-5 py-2.5 shadow-sm hover:shadow">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 grid md:grid-cols-[1fr_320px] gap-10">
      <div className="space-y-6">
        {items.map(({ id, name, image, price, qty, lineTotal }) => (
          <div key={id} className="flex gap-4 items-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-4">
            <Image src={image} alt={name} width={96} height={96} className="rounded-lg object-cover" />
            <div className="flex-1">
              <div className="font-medium">{name}</div>
              <div className="text-sm text-[var(--muted)]">${(price / 100).toFixed(2)}</div>
              <div className="mt-2 flex items-center gap-3">
                <label className="text-sm text-[var(--muted)]">Qty</label>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => cart.setQty(id, Math.max(1, Number(e.target.value) || 1))}
                  className="w-16 rounded-lg border border-black/10 px-2 py-1 text-center"
                />
                <button onClick={() => cart.remove(id)} className="text-sm underline">
                  Remove
                </button>
              </div>
            </div>
            <div className="text-right font-medium">${(lineTotal / 100).toFixed(2)}</div>
          </div>
        ))}
      </div>

      <aside className="rounded-xl bg-white shadow-sm ring-1 ring-black/5 p-5 h-fit">
        <div className="flex justify-between">
          <span className="text-sm text-[var(--muted)]">Subtotal</span>
          <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
        </div>
        <div className="mt-6">
          <form action="/api/checkout" method="POST">
            <button className="w-full rounded-xl bg-[var(--gold)] px-5 py-2.5 font-medium shadow-sm hover:shadow">
              Checkout
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
}