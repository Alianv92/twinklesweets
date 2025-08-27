// src/app/thank-you/page.tsx
"use client";

import { useEffect, useState } from "react";

type CheckoutStatus = {
  id: string;
  status: string | null;
  payment_status: string | null;
  amount_total: number | null;
  currency: string | null;
  payment_intent_status: string | null;
} | { error: string };

export default function ThankYou() {
  const [data, setData] = useState<CheckoutStatus | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");
    if (!sid) {
      setData({ error: "No session_id provided" });
      return;
    }
    fetch(`/api/checkout/session?id=${encodeURIComponent(sid)}`)
      .then((r) => r.json())
      .then(setData)
      .catch((err) => setData({ error: String(err) }));
  }, []);

  const paid =
    data &&
    "payment_status" in data &&
    (data.payment_status === "paid" ||
      (data as any).payment_intent_status === "succeeded");

  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">
        {paid ? "Thank you!" : "We’re checking your payment"}
      </h1>
      <p className="mt-3 text-[var(--muted)]">
        {data == null && "Loading payment status…"}
        {data && "error" in data && `Error: ${data.error}`}
        {paid && "Your order was completed successfully."}
        {data &&
          !("error" in data) &&
          !paid &&
          `Status: ${data.payment_status ?? data.status ?? "unknown"}`}
      </p>
    </main>
  );
}