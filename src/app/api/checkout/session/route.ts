// src/app/api/checkout/session/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing session id" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(id);
    // Optional: also retrieve the PaymentIntent for more details
    const paymentIntentId = session.payment_intent;
    let paymentIntent: Stripe.Response<Stripe.PaymentIntent> | null = null;
    if (typeof paymentIntentId === "string") {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    }

    return NextResponse.json({
      id: session.id,
      status: session.status,           // e.g., "complete"
      payment_status: session.payment_status, // e.g., "paid"
      amount_total: session.amount_total,
      currency: session.currency,
      payment_intent_status: paymentIntent?.status ?? null,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Lookup error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}