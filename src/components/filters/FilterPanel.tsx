import { useState } from 'react';
import { SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { useFilters } from '../../hooks/useFilters';
import { StopsFilter } from './StopsFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { AirlineFilter } from './AirlineFilter';
import { TimeFilter } from './TimeFilter';
import type { SortOption } from '../../types/flight';

interface FilterPanelProps {
  className?: string;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'duration-asc', label: 'Duration: Shortest' },
  { value: 'departure-asc', label: 'Departure: Earliest' },
  { value: 'departure-desc', label: 'Departure: Latest' },
];

export function FilterPanel({ className = '' }: FilterPanelProps) {
  const { sortOption, setSortOption, resetFilters, hasActiveFilters, priceStats } =
    useFilters();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const activeFilters = hasActiveFilters();

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex gap-2 mb-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex-1 btn-secondary flex items-center justify-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilters && (
            <span className="w-2 h-2 bg-primary-500 rounded-full" />
          )}
        </button>
        <div className="relative">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="btn-secondary appearance-none pr-8 cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl animate-slide-in">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-140px)]">
              <div className="space-y-6">
                <StopsFilter />
                <div className="border-t border-gray-100 pt-6">
                  <PriceRangeFilter />
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <AirlineFilter />
                </div>
                <div className="border-t border-gray-100 pt-6">
                  <TimeFilter />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 btn-secondary"
                disabled={!activeFilters}
              >
                Clear all
              </button>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="flex-1 btn-primary"
              >
                Show {priceStats.count} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Panel */}
      <div className={`hidden lg:block ${className}`}>
        <div className="card p-4">
          {/* Sort */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Sort by</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filters */}
          <div className="space-y-6">
            <StopsFilter />
            <div className="border-t border-gray-100 pt-6">
              <PriceRangeFilter />
            </div>
            <div className="border-t border-gray-100 pt-6">
              <AirlineFilter />
            </div>
            <div className="border-t border-gray-100 pt-6">
              <TimeFilter />
            </div>
          </div>

          {/* Clear Filters */}
          {activeFilters && (
            <button
              onClick={resetFilters}
              className="w-full mt-6 btn-secondary text-sm"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>
    </>
  );
}
