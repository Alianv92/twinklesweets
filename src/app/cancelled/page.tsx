export default function Cancelled() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold">Payment cancelled</h1>
      <p className="mt-3 text-[var(--muted)]">
        No charge was made. You can try again any time.
      </p>
    </main>
  );
}