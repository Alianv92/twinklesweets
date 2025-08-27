"use client";

import { useCart } from "@/lib/cart";
import { useState } from "react";

export default function CartPage() {
  const cart = useCart();
  const [loading, setLoading] = useState(false);

  const lines = cart.items;

  const subtotal = lines.reduce((sum, l) => sum + l.qty * l.price, 0);

  async function handleCheckout() {
    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            id: i.id,
            qty: i.qty,
          })),
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Checkout failed: " + error.error);
        setLoading(false);
        return;
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        alert("No checkout URL returned");
        setLoading(false);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout.");
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

      {lines.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="divide-y divide-gray-200">
            {lines.map((l) => (
              <li key={l.id} className="py-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-gray-500">
                    ${(l.price / 100).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm">Qty: {l.qty}</span>
                  <button
                    onClick={() => cart.remove(l.id)}
                    className="text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between text-lg font-semibold">
            <span>Subtotal</span>
            <span>${(subtotal / 100).toFixed(2)}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-8 w-full bg-[var(--gold)] text-white py-3 px-6 rounded-lg shadow hover:shadow-md disabled:opacity-50"
          >
            {loading ? "Processing..." : "Checkout"}
          </button>
        </div>
      )}
    </main>
  );
}