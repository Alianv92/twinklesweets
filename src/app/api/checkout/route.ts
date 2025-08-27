import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "../../../lib/products";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn(
    "STRIPE_SECRET_KEY is not set. Set it in .env.local (dev) and in Vercel Project Settings (prod)."
  );
}

const stripe = new Stripe(stripeSecret || "", { apiVersion: "2025-07-30.basil" });

type CheckoutItem = { id: string; qty: number };
type CheckoutBody = { items: CheckoutItem[] };

/** Ensure we always return a fully-qualified origin with scheme. */
function getBaseUrl(req: NextRequest): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl) {
    // If user provided NEXT_PUBLIC_SITE_URL without scheme, add https://
    if (!/^https?:\/\//i.test(envUrl)) return `https://${envUrl}`;
    return envUrl;
  }

  const origin = req.headers.get("origin");
  if (origin && /^https?:\/\//i.test(origin)) return origin;

  const host = req.headers.get("host");
  if (host) return `https://${host}`;

  // Last-resort fallback for uncommon environments:
  return "http://localhost:3000";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CheckoutBody;

    if (!body || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Validate and map items -> Stripe line items
    const line_items = body.items.map(({ id, qty }) => {
      const p = PRODUCTS.find((pr) => pr.id === id);
      if (!p) {
        throw new Error(`Unknown product: ${id}`);
      }
      return {
        quantity: qty,
        price_data: {
          currency: "usd",
          product_data: { name: p.name },
          unit_amount: p.price, // price is in cents in PRODUCTS
        },
      } as const;
    });

    const baseUrl = getBaseUrl(req);
    const success_url = `${baseUrl}/thank-you`;
    const cancel_url = `${baseUrl}/cancelled`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url,
      cancel_url,
      shipping_address_collection: { allowed_countries: ["US", "CA"] },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Checkout error (unable to parse request)";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}