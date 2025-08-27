"use client";

import { useCart } from "../../lib/cart";
import { useState } from "react";

export default function CartPage() {
  const cart = useCart();
  const [loading, setLoading] = useState(false);

  const lines = cart.items;

  async function handleCheckout() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart.items }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed: " + (data.error ?? "Unknown error"));
      }
    } catch (err) {
      console.error("Checkout error", err);
      alert("Checkout error. See console.");
    } finally {
      setLoading(false);
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {lines.length === 0 ? (
        <p className="text-[var(--muted)]">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center justify-between py-4">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-[var(--muted)]">
                    ${(l.price / 100).toFixed(2)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={l.qty}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      cart.setQty(l.id, Number(e.target.value))
                    }
                    className="w-16 rounded-lg border border-black/10 px-2 py-1 text-center"
                  />
                  <button
                    onClick={() => cart.remove(l.id)}
                    className="text-sm underline text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-lg font-semibold">Subtotal</span>
            <span className="text-lg font-semibold">
              {(subtotal / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>

          <div className="mt-8">
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full rounded-xl bg-[var(--gold)] px-6 py-3 font-medium shadow-sm hover:shadow disabled:opacity-50"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}