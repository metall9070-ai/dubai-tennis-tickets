export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Navbar skeleton */}
      <div className="h-16 bg-white border-b border-[#d2d2d7]" />

      {/* Order summary skeleton */}
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl p-8 space-y-6">
          <div className="h-8 w-48 bg-[#d2d2d7] rounded-lg animate-pulse mx-auto" />
          <div className="h-16 w-16 bg-[#e5e5ea] rounded-full animate-pulse mx-auto" />
          <div className="space-y-3">
            <div className="h-5 w-full bg-[#e5e5ea] rounded animate-pulse" />
            <div className="h-5 w-3/4 bg-[#e5e5ea] rounded animate-pulse" />
            <div className="h-5 w-1/2 bg-[#e5e5ea] rounded animate-pulse" />
          </div>
          <div className="border-t border-[#d2d2d7] pt-4">
            <div className="h-6 w-32 bg-[#e5e5ea] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
