// Skeleton base component with shimmer effect
function SkeletonPulse({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`relative overflow-hidden bg-gray-200 rounded ${className}`}
      style={style}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}

// Flight Card Skeleton
export function FlightCardSkeleton() {
  return (
    <div className="card p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Flight Info Skeleton */}
        <div className="flex-1 space-y-4">
          {/* Outbound */}
          <div className="flex items-center gap-4">
            <SkeletonPulse className="w-10 h-10 rounded-lg" />
            <div className="flex-1">
              <SkeletonPulse className="h-3 w-20 mb-2" />
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <SkeletonPulse className="h-5 w-12 mb-1" />
                  <SkeletonPulse className="h-3 w-8" />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <SkeletonPulse className="h-2 w-12 mb-2" />
                  <SkeletonPulse className="h-px w-full" />
                  <SkeletonPulse className="h-2 w-16 mt-2" />
                </div>
                <div className="text-center">
                  <SkeletonPulse className="h-5 w-12 mb-1" />
                  <SkeletonPulse className="h-3 w-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Return */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <SkeletonPulse className="w-10 h-10 rounded-lg" />
            <div className="flex-1">
              <SkeletonPulse className="h-3 w-16 mb-2" />
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <SkeletonPulse className="h-5 w-12 mb-1" />
                  <SkeletonPulse className="h-3 w-8" />
                </div>
                <div className="flex-1 flex flex-col items-center">
                  <SkeletonPulse className="h-2 w-12 mb-2" />
                  <SkeletonPulse className="h-px w-full" />
                  <SkeletonPulse className="h-2 w-16 mt-2" />
                </div>
                <div className="text-center">
                  <SkeletonPulse className="h-5 w-12 mb-1" />
                  <SkeletonPulse className="h-3 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price Skeleton */}
        <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 lg:gap-2 lg:min-w-[140px] pt-3 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-100">
          <div className="lg:text-right">
            <SkeletonPulse className="h-7 w-24 mb-1" />
            <SkeletonPulse className="h-3 w-16" />
          </div>
          <SkeletonPulse className="h-10 w-20 rounded-lg" />
        </div>
      </div>

      {/* View details skeleton */}
      <div className="mt-4 flex justify-center">
        <SkeletonPulse className="h-4 w-24" />
      </div>
    </div>
  );
}

// Multiple Flight Cards Skeleton
export function FlightListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {/* Results count skeleton */}
      <SkeletonPulse className="h-4 w-40" />

      {Array.from({ length: count }).map((_, i) => (
        <FlightCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Price Graph Skeleton
export function PriceGraphSkeleton() {
  return (
    <div className="card p-4 sm:p-6">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div>
          <SkeletonPulse className="h-4 w-32 mb-1" />
          <SkeletonPulse className="h-3 w-24" />
        </div>
        <SkeletonPulse className="h-4 w-28" />
      </div>

      {/* Price Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg">
            <SkeletonPulse className="h-3 w-12 mx-auto mb-2" />
            <SkeletonPulse className="h-5 w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Chart Area */}
      <div className="h-32 sm:h-48 flex items-end justify-between gap-1 px-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end">
            <SkeletonPulse
              className="w-full rounded-t"
              style={{
                height: `${Math.random() * 60 + 20}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-4">
        <SkeletonPulse className="h-3 w-24" />
        <SkeletonPulse className="h-3 w-20" />
      </div>
    </div>
  );
}

// Filter Panel Skeleton
export function FilterPanelSkeleton() {
  return (
    <div className="card p-4">
      {/* Sort */}
      <div className="mb-6">
        <SkeletonPulse className="h-4 w-16 mb-3" />
        <SkeletonPulse className="h-10 w-full rounded-lg" />
      </div>

      {/* Stops Filter */}
      <div className="mb-6">
        <SkeletonPulse className="h-4 w-12 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonPulse className="w-4 h-4 rounded" />
              <SkeletonPulse className="h-3 flex-1" />
              <SkeletonPulse className="h-3 w-6" />
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6 pt-6 border-t border-gray-100">
        <SkeletonPulse className="h-4 w-24 mb-3" />
        <div className="flex justify-between mb-4">
          <SkeletonPulse className="h-4 w-16" />
          <SkeletonPulse className="h-4 w-16" />
        </div>
        <SkeletonPulse className="h-2 w-full rounded-full" />
      </div>

      {/* Airlines */}
      <div className="pt-6 border-t border-gray-100">
        <SkeletonPulse className="h-4 w-16 mb-3" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <SkeletonPulse className="w-4 h-4 rounded" />
              <SkeletonPulse className="h-3 flex-1" />
              <SkeletonPulse className="h-3 w-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
