export default function EventLoading() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Navbar skeleton */}
      <div className="h-16 bg-white border-b border-[#d2d2d7]" />

      {/* Event hero skeleton */}
      <div className="w-full bg-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="h-5 w-24 bg-[#e5e5ea] rounded animate-pulse mb-3" />
          <div className="h-9 w-80 bg-[#d2d2d7] rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-48 bg-[#e5e5ea] rounded animate-pulse" />
        </div>
      </div>

      {/* Category cards skeleton */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 flex items-center gap-4">
            <div className="w-3 h-12 bg-[#e5e5ea] rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-36 bg-[#e5e5ea] rounded animate-pulse" />
              <div className="h-4 w-24 bg-[#e5e5ea] rounded animate-pulse" />
            </div>
            <div className="h-10 w-20 bg-[#e5e5ea] rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
