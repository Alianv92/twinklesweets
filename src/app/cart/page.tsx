"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "../../lib/cart";
import { PRODUCTS } from "../../lib/products";

export default function CartPage() {
  const cart = useCart();
  const [busy, setBusy] = useState(false);

  const lines = useMemo(() => {
    return cart.items.map((it) => {
      const p = PRODUCTS.find((x) => x.id === it.id);
      return p ? { ...p, qty: it.qty } : null;
    }).filter(Boolean) as Array<{ id: string; name: string; price: number; image: string; qty: number }>;
  }, [cart.items]);

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);

  async function handleCheckout() {
    try {
      setBusy(true);

      const payload = {
        items: cart.items.map(({ id, qty }) => ({ id, qty })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.error || "Checkout failed");
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url as string;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      alert(err?.message || "Checkout error");
    } finally {
      setBusy(false);
    }
  }

  if (lines.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-3 text-[var(--muted)]">
          Browse our designs and add something you love.
        </p>
        <Link
          href="/#products"
          className="inline-block mt-6 rounded-xl bg-[var(--gold)] px-5 py-2.5 font-medium shadow-sm hover:shadow"
        >
          Shop products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Cart</h1>

      <ul className="mt-6 divide-y divide-black/10 rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
        {lines.map((l) => (
          <li key={l.id} className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-medium">{l.name}</div>
              <div className="text-sm text-[var(--muted)]">
                {(l.price / 100).toLocaleString(undefined, {
                  style: "currency",
                  currency: "USD",
                })}{" "}
                × {l.qty}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                className="w-16 rounded-lg border border-black/20 px-2 py-1 text-center"
                min={1}
                value={l.qty}
                onChange={(e) => cart.setQty(l.id, Number(e.target.value))}
              />
              <button
                className="text-sm underline"
                onClick={() => cart.remove(l.id)}
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-lg">
          <span className="text-[var(--muted)] mr-2">Subtotal:</span>
          <span className="font-semibold">
            {(subtotal / 100).toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
            })}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={busy}
          className="rounded-xl bg-[var(--gold)] px-5 py-2.5 font-medium shadow-sm hover:shadow disabled:opacity-60"
        >
          {busy ? "Redirecting…" : "Checkout"}
        </button>
      </div>
    </main>
  );
}