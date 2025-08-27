"use client";

import Link from "next/link";
import CartLink from "./CartLink";

export function SiteHeader() {
  return (
    <header className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-xl font-semibold tracking-tight">TwinkleSweets</Link>
      <nav className="hidden md:flex gap-6 text-sm">
        <Link href="/products" className="hover:opacity-80">Products</Link>
        <Link href="/custom-order" className="hover:opacity-80">Custom Order</Link>
        <Link href="/faq" className="hover:opacity-80">FAQ</Link>
        <CartLink />
      </nav>
    </header>
  );
}