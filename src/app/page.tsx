import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section — soft gradient, not black */}
      <section className="bg-gradient-to-b from-[#FFF9F5] to-[var(--paper)]">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-16 grid md:grid-cols-2 gap-10 items-center">
          <div className="order-2 md:order-1">
            <h1 className="font-serif text-5xl md:text-6xl leading-tight">
              Celebrate with custom toppers & decorated boxes
            </h1>
            <p className="mt-4 text-[17px] text-[var(--muted)] max-w-prose">
              TwinkleSweets creates personalized cake toppers, decorated treat boxes,
              and event details to make your celebration unforgettable.
            </p>
            <a
              href="https://buy.stripe.com/test-link"
              className="inline-block mt-7 rounded-xl bg-[var(--gold)] px-6 py-3 text-base font-medium shadow-sm hover:shadow transition"
            >
              Shop Now
            </a>
          </div>

          {/* Light “photo” area */}
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

      {/* Featured Designs — white cards on blush backdrop */}
      <section id="products" className="py-14 bg-[var(--blush)]/60">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-serif text-3xl md:text-4xl">Featured Designs</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Custom Cake Toppers",
              "Decorated Treat Boxes",
              "Event Favor Packaging",
              "Themed Party Sets",
              "Name & Number Toppers",
              "Special Occasion Décor",
            ].map((name, index) => (
              <article key={name} className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-5">
                <Image
                  src={`/Product${index+1}.png`}
                  alt={name}
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-xl object-cover"
                />
                <h3 className="mt-3 text-sm font-medium">{name}</h3>
                <a href="https://buy.stripe.com/test-link" className="mt-3 inline-block text-sm underline">
                  Order now
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials — clean white band */}
      <section id="testimonials" className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl">What Customers Say</h2>
          <blockquote className="mt-6 text-lg text-[#4A433E]">
            “The topper and decorated boxes were absolutely perfect! Everyone at the party loved them.”
          </blockquote>
          <div className="mt-2 text-sm text-[var(--muted)]">— Maria G.</div>
        </div>
      </section>
    </div>
  );
}