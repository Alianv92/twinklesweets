// src/app/thank-you/page.tsx
import Link from "next/link";

type ThankYouSearchParams = {
  session_id?: string;
};

export default function ThankYouPage({
  searchParams,
}: {
  searchParams: ThankYouSearchParams;
}) {
  const sessionId = searchParams?.session_id ?? null;

  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-4xl font-serif mb-4">Thank you!</h1>
      <p className="text-[var(--muted)]">
        Your order was completed successfully.
      </p>

      {sessionId && (
        <p className="mt-4 text-sm text-[var(--muted)]">
          Payment reference: <code className="px-1">{sessionId}</code>
        </p>
      )}

      <div className="mt-8">
        <Link
          href="/"
          className="inline-block rounded-xl bg-[var(--gold)] px-5 py-2.5 font-medium shadow-sm hover:shadow"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}