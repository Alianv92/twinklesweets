// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TwinkleSweets • Elegant Cake Toppers",
  description: "Elegant, modern cake toppers for birthdays and special events. Handmade to order.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
        {/* Top bar */}
        <header className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
  <Link href="/" className="text-xl font-semibold tracking-tight">
    TwinkleSweets
  </Link>
  <nav className="hidden md:flex gap-6 text-sm">
    <Link href="/products" className="hover:opacity-80">Products</Link>
    <Link href="/custom-order" className="hover:opacity-80">Custom Order</Link>
    <Link href="/faq" className="hover:opacity-80">FAQ</Link>
  </nav>
</header>

        {/* Page content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-black/5 bg-[var(--chip)] mt-16">
          <div className="mx-auto max-w-6xl px-6 py-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm text-[#6F6761]">
                Follow on Instagram and TikTok. Visit our Etsy shop for more designs.
              </p>
              <div className="mt-4 flex gap-4">
                <a href="https://instagram.com/yourhandle" className="rounded-full bg-white w-10 h-10 grid place-items-center shadow-sm ring-1 ring-black/5">IG</a>
                <a href="https://tiktok.com/@yourhandle" className="rounded-full bg-white w-10 h-10 grid place-items-center shadow-sm ring-1 ring-black/5">TT</a>
                <a href="https://etsy.com/shop/yourshop" className="rounded-full bg-white w-10 h-10 grid place-items-center shadow-sm ring-1 ring-black/5">E</a>
              </div>
            </div>

            <form action="https://formspree.io/f/your-newsletter" method="POST" className="bg-white rounded-2xl shadow-sm ring-1 ring-black/5 p-3 flex items-center gap-3">
              <input type="email" name="email" placeholder="Enter your email" className="w-full rounded-xl border border-black/10 px-4 py-2" required />
              <button type="submit" className="rounded-xl bg-[#E9D9C3] px-5 py-2.5 font-medium shadow-sm hover:shadow">
                Subscribe
              </button>
            </form>
          </div>
          <div className="py-6 text-center text-xs text-[#8B817B]">
            © {new Date().getFullYear()} TwinkleSweets. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}