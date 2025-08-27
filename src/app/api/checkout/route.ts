import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PRODUCTS } from "../../../lib/products";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn("STRIPE_SECRET_KEY is not set. Set it in .env.local for local dev.");
}

const stripe = new Stripe(stripeSecret || "", { apiVersion: "2024-06-20" });

export async function POST(req: Request) {
  try {
    const { items }: { items: { id: string; qty: number }[] } = await req.json();

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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: "http://localhost:3000/thank-you",
      cancel_url: "http://localhost:3000/cancelled",
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message ?? "Checkout error" },
      { status: 400 }
    );
  }
}