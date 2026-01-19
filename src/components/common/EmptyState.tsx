import { Plane, Search, SlidersHorizontal, MapPin, Calendar } from 'lucide-react';

type EmptyStateType = 'initial' | 'no-results' | 'no-filter-results' | 'error';

interface EmptyStateProps {
  type: EmptyStateType;
  totalFlights?: number;
  onClearFilters?: () => void;
  errorMessage?: string;
  onRetry?: () => void;
}

export function EmptyState({
  type,
  totalFlights = 0,
  onClearFilters,
  errorMessage,
  onRetry,
}: EmptyStateProps) {
  if (type === 'initial') {
    return (
      <div className="card p-8 sm:p-12 text-center">
        {/* Animated Plane Illustration */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-primary-100 rounded-full animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Plane className="w-16 h-16 text-primary-500 transform -rotate-12" />
              {/* Animated clouds */}
              <div className="absolute -top-2 -right-4 w-6 h-4 bg-primary-200 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="absolute -bottom-1 -left-3 w-4 h-3 bg-primary-200 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ready for takeoff?
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          Enter your travel details above to discover amazing flight deals to destinations worldwide.
        </p>

        {/* Quick tips */}
        <div className="flex flex-wrap justify-center gap-3 text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Choose destination</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Pick dates</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-gray-600">
            <Search className="w-4 h-4" />
            <span>Search flights</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'no-results') {
    return (
      <div className="card p-8 sm:p-12 text-center">
        {/* Empty search illustration */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-gray-100 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Search className="w-12 h-12 text-gray-300" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-500 text-lg font-bold">?</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No flights found
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          We couldn't find any flights for your search. This might be due to limited availability on the selected dates.
        </p>

        {/* Suggestions */}
        <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto text-left">
          <p className="text-sm font-medium text-blue-900 mb-2">Try these tips:</p>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Try different travel dates</li>
            <li>• Search for nearby airports</li>
            <li>• Check if the route has connecting flights</li>
          </ul>
        </div>
      </div>
    );
  }

  if (type === 'no-filter-results') {
    return (
      <div className="card p-8 sm:p-12 text-center">
        {/* Filter illustration */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-orange-50 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <SlidersHorizontal className="w-12 h-12 text-orange-400" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center">
                <span className="text-orange-500 text-xl font-bold">0</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No matches for your filters
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          {totalFlights} flights found, but none match your current filter criteria. Try adjusting your filters.
        </p>

        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="btn-primary"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  if (type === 'error') {
    return (
      <div className="card p-8 sm:p-12 text-center">
        {/* Error illustration */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <div className="absolute inset-0 bg-red-50 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <Plane className="w-12 h-12 text-red-300 transform rotate-45" />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-xl font-bold">!</span>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-500 max-w-md mx-auto mb-6">
          {errorMessage || 'We encountered an error while searching for flights. Please try again.'}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-primary"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return null;
}
