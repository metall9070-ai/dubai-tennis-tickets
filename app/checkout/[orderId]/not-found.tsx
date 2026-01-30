import Link from 'next/link';

export default function OrderNotFound() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🎫</div>
        <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">Order Not Found</h1>
        <p className="text-[#86868b] mb-6">
          We couldn&apos;t find the order you&apos;re looking for. It may have been cancelled or the link is incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-[#1e824c] text-white rounded-full font-medium hover:bg-[#166638] transition-colors"
          >
            Back to Home
          </Link>
          <Link
            href="/tickets/wta"
            className="px-6 py-3 bg-[#1d1d1f] text-white rounded-full font-medium hover:bg-[#333] transition-colors"
          >
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
}
