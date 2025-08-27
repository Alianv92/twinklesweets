import Stripe from "stripe";
import { NextResponse } from "next/server";
import { PRODUCTS } from "@/lib/products";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error("❌ STRIPE_SECRET_KEY is missing. Add it in your .env.local or Vercel env.");
}

const stripe = new Stripe(stripeSecret ?? "", {
  apiVersion: "2024-06-20", // use the latest stable Stripe API version
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty or invalid request" }, { status: 400 });
    }

    const line_items = body.items.map(({ id, qty }: { id: string; qty: number }) => {
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

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${baseUrl}/thank-you`,
      cancel_url: `${baseUrl}/cancelled`,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Checkout error";
    console.error("❌ Checkout failed:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}