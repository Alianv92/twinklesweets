"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCTS } from "@/lib/products";
import { useCart } from "@/lib/cart";

function AddBtn({ id }: { id: string }) {
  const cart = useCart();
  const [status, setStatus] = useState<"idle" | "added">("idle");

  function handleAdd() {
    cart.add(id, 1);
    setStatus("added");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <button
      onClick={handleAdd}
      className={`mt-3 rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition 
        ${status === "added" ? "bg-green-500 text-white" : "bg-[var(--gold)] hover:shadow"}
      `}
    >
      {status === "added" ? "Added!" : "Add to cart"}
    </button>
  );
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[#FFF9F5] to-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">
              Celebrate with custom toppers & decorated boxes
            </h1>
            <p className="mt-4 text-[17px] text-[var(--muted)] max-w-prose">
              TwinkleSweets creates personalized cake toppers, decorated treat
              boxes, and event details to make your celebration unforgettable.
            </p>
            <a
              href="#products"
              className="inline-block mt-7 rounded-xl bg-[var(--gold)] px-6 py-3 text-base font-medium shadow-sm hover:shadow transition"
            >
              Shop Now
            </a>
          </div>

          <div className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-sm ring-1 ring-black/5">
            <Image
              src="/hero.jpg"
              alt="TwinkleSweets product photo"
              width={600}
              height={500}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      <section id="products" className="py-14 bg-[var(--blush)]/60">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-serif text-3xl md:text-4xl">
            Featured Designs
          </h2>
        </div>

        <div className="mx-auto max-w-6xl px-6 mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <article key={p.id} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
              <Image
                src={p.image}
                alt={p.name}
                width={400}
                height={400}
                className="w-full h-auto rounded-xl object-cover"
              />
              <h3 className="mt-3 text-sm font-medium">{p.name}</h3>
              <div className="mt-1 text-sm text-[var(--muted)]">
                ${(p.price / 100).toFixed(2)}
              </div>
              <AddBtn id={p.id} />
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl">What Customers Say</h2>
          <blockquote className="mt-6 text-lg text-[#4A433E]">
            “The topper and decorated boxes were absolutely perfect! Everyone at
            the party loved them.”
          </blockquote>
          <div className="mt-2 text-sm text-[var(--muted)]">— Maria G.</div>
        </div>
      </section>
    </div>
  );
}