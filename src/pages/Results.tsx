import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plane, ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { SearchForm } from '../components/search/SearchForm';
import { FlightList } from '../components/results/FlightList';
import { FilterPanel } from '../components/filters/FilterPanel';
import { PriceGraph } from '../components/charts/PriceGraph';
import { PriceGraphSkeleton, FilterPanelSkeleton } from '../components/common/Skeletons';
import { hasSearchedAtom, flightResultsAtom, searchParamsAtom, isLoadingAtom } from '../atoms/flightAtoms';

export function Results() {
  const hasSearched = useRecoilValue(hasSearchedAtom);
  const flights = useRecoilValue(flightResultsAtom);
  const searchParams = useRecoilValue(searchParamsAtom);
  const isLoading = useRecoilValue(isLoadingAtom);
  const showSidebar = hasSearched && (flights.length > 0 || isLoading);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Create search summary for collapsed view
  const searchSummary = searchParams.origin && searchParams.destination
    ? `${searchParams.origin.cityName} → ${searchParams.destination.cityName}`
    : 'Search flights';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-3 text-gray-900 hover:text-primary-600 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Plane className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold hidden sm:block">SkySearch</span>
            </Link>

            <Link
              to="/"
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">New Search</span>
              <span className="sm:hidden">Back</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Search Bar - Collapsible on mobile */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Mobile collapsed search */}
          <div className="sm:hidden py-3">
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-gray-900">{searchSummary}</span>
              </div>
              {isSearchExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {isSearchExpanded && (
              <div className="mt-3 animate-fade-in">
                <SearchForm />
              </div>
            )}
          </div>

          {/* Desktop search form */}
          <div className="hidden sm:block py-4">
            <SearchForm />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:flex lg:gap-6">
          {/* Sidebar - Desktop only */}
          {showSidebar && (
            <aside className="hidden lg:block lg:w-72 flex-shrink-0 space-y-6">
              {isLoading ? (
                <>
                  <PriceGraphSkeleton />
                  <FilterPanelSkeleton />
                </>
              ) : (
                <>
                  <PriceGraph />
                  <FilterPanel />
                </>
              )}
            </aside>
          )}

          {/* Flight Results */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filters */}
            {showSidebar && !isLoading && <FilterPanel className="lg:hidden" />}

            {/* Mobile Price Graph */}
            {showSidebar && (
              <div className="lg:hidden mb-4">
                {isLoading ? <PriceGraphSkeleton /> : <PriceGraph />}
              </div>
            )}

            <FlightList />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8 sm:mt-12 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-gray-500">
          <p>
            Flight data provided by Amadeus API. Prices shown are for demonstration
            purposes and may not reflect actual availability.
          </p>
        </div>
      </footer>
    </div>
  );
}
