import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PRODUCTS } from "../../../lib/products";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn("⚠️ STRIPE_SECRET_KEY is not set. Set it in .env.local for local dev.");
}

const stripe = new Stripe(stripeSecret || "", { apiVersion: "2024-06-20" });

type CheckoutItem = {
  id: string;
  qty: number;
};

export async function POST(req: Request) {
  try {
    const { items }: { items: CheckoutItem[] } = await req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const line_items = items.map(({ id, qty }) => {
      const p = PRODUCTS.find((pr) => pr.id === id);
      if (!p) throw new Error(`Unknown product: ${id}`);
      return {
        quantity: qty,
        price_data: {
          currency: "usd",
          product_data: { name: p.name },
          unit_amount: p.price,
        },
      } as const;
    });

    // ✅ Build base URL dynamically
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/thank-you`,
      cancel_url: `${baseUrl}/cancelled`,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Checkout error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}