export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Navbar skeleton */}
      <div className="h-16 bg-white border-b border-[#d2d2d7]" />

      {/* Hero skeleton */}
      <div className="w-full h-[400px] bg-[#e5e5ea] animate-pulse" />

      {/* Content skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-[#d2d2d7] rounded-lg animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 space-y-3">
              <div className="h-4 w-16 bg-[#e5e5ea] rounded animate-pulse" />
              <div className="h-6 w-3/4 bg-[#e5e5ea] rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-[#e5e5ea] rounded animate-pulse" />
              <div className="h-10 w-full bg-[#e5e5ea] rounded-xl animate-pulse mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
