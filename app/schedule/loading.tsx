export default function ScheduleLoading() {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Navbar skeleton */}
      <div className="h-16 bg-white border-b border-[#d2d2d7]" />

      {/* Header skeleton */}
      <div className="max-w-6xl mx-auto px-4 pt-12 pb-6">
        <div className="h-10 w-64 bg-[#d2d2d7] rounded-lg animate-pulse mb-2" />
        <div className="h-5 w-96 bg-[#e5e5ea] rounded animate-pulse" />
      </div>

      {/* Event list skeleton */}
      <div className="max-w-6xl mx-auto px-4 pb-12 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-4">
            <div className="w-14 h-14 bg-[#e5e5ea] rounded-xl animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-48 bg-[#e5e5ea] rounded animate-pulse" />
              <div className="h-4 w-32 bg-[#e5e5ea] rounded animate-pulse" />
            </div>
            <div className="h-10 w-28 bg-[#e5e5ea] rounded-xl animate-pulse shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
