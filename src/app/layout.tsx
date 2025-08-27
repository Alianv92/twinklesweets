import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../lib/cart";
import { SiteHeader } from "../components/SiteHeader";

export const metadata: Metadata = {
  title: "TwinkleSweets • Elegant Cake Toppers",
  description: "Elegant, modern cake toppers and decorated boxes. Handmade to order.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        <CartProvider>
          <SiteHeader />
          <main>{children}</main>

          <footer className="border-t border-black/5 bg-[var(--chip)] mt-16">
            <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm text-[var(--muted)]">
                  Follow on Instagram and TikTok. Visit our Etsy shop for more designs.
                </p>
                <div className="mt-4 flex gap-4">
                  <a href="https://instagram.com/twinklesweetsco" className="rounded-full bg-white w-10 h-10 grid place-items-center shadow-sm ring-1 ring-black/5" aria-label="Instagram">IG</a>
                  <a href="https://tiktok.com/twinklesweetsco" className="rounded-full bg-white w-10 h-10 grid place-items-center shadow-sm ring-1 ring-black/5" aria-label="TikTok">TT</a>
                  <a href="https://etsy.com/shop/yourshop" className="rounded-full bg-white w-10 h-10 grid place-items-center shadow-sm ring-1 ring-black/5" aria-label="Etsy">E</a>
                </div>
              </div>

              <form action="https://formspree.io/f/your-newsletter" method="POST" className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-3 flex items-center gap-3">
                <input type="email" name="email" placeholder="Enter your email" className="w-full rounded-xl border border-black/10 px-4 py-2" required />
                <button type="submit" className="rounded-xl bg-[var(--gold)] px-5 py-2.5 font-medium shadow-sm hover:shadow">Subscribe</button>
              </form>
            </div>
            <div className="py-6 text-center text-xs text-[var(--muted)]">
              © {new Date().getFullYear()} TwinkleSweets. All rights reserved.
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}