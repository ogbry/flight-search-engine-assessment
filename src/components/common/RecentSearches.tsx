import { useEffect, useState } from 'react';
import { Clock, X, ArrowRight } from 'lucide-react';
import { useFlightSearch } from '../../hooks/useFlightSearch';
import { format, parseISO } from 'date-fns';
import type { Airport } from '../../types/flight';

interface RecentSearch {
  id: string;
  origin: Airport;
  destination: Airport;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  timestamp: number;
}

const STORAGE_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 5;

export function getRecentSearches(): RecentSearch[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveRecentSearch(search: Omit<RecentSearch, 'id' | 'timestamp'>): void {
  try {
    const searches = getRecentSearches();

    // Create new search entry
    const newSearch: RecentSearch = {
      ...search,
      id: `${search.origin.iataCode}-${search.destination.iataCode}-${Date.now()}`,
      timestamp: Date.now(),
    };

    // Remove duplicate routes
    const filtered = searches.filter(
      (s) =>
        !(s.origin.iataCode === search.origin.iataCode &&
          s.destination.iataCode === search.destination.iataCode)
    );

    // Add new search at the beginning
    const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save recent search:', e);
  }
}

export function clearRecentSearches(): void {
  localStorage.removeItem(STORAGE_KEY);
}

interface RecentSearchesProps {
  onSelect?: () => void;
}

export function RecentSearches({ onSelect }: RecentSearchesProps) {
  const [searches, setSearches] = useState<RecentSearch[]>([]);
  const { updateSearchParams, search } = useFlightSearch();

  useEffect(() => {
    setSearches(getRecentSearches());
  }, []);

  const handleSelect = async (recentSearch: RecentSearch) => {
    updateSearchParams({
      origin: recentSearch.origin,
      destination: recentSearch.destination,
      departureDate: recentSearch.departureDate,
      returnDate: recentSearch.returnDate,
      adults: recentSearch.passengers,
    });

    // Trigger search after a short delay to allow state to update
    setTimeout(() => {
      search();
      onSelect?.();
    }, 100);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = searches.filter((s) => s.id !== id);
    setSearches(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setSearches([]);
    clearRecentSearches();
  };

  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Recent Searches
        </h3>
        <button
          onClick={handleClearAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {searches.map((s) => (
          <button
            key={s.id}
            onClick={() => handleSelect(s)}
            className="group flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-primary-50 rounded-lg border border-gray-200 hover:border-primary-200 transition-colors text-left"
          >
            <div className="flex items-center gap-1 text-sm font-medium text-gray-900">
              <span>{s.origin.iataCode}</span>
              <ArrowRight className="w-3 h-3 text-gray-400" />
              <span>{s.destination.iataCode}</span>
            </div>
            <span className="text-xs text-gray-500">
              {format(parseISO(s.departureDate), 'MMM d')}
              {s.returnDate && ` - ${format(parseISO(s.returnDate), 'MMM d')}`}
            </span>
            <button
              onClick={(e) => handleRemove(s.id, e)}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 rounded transition-opacity"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </button>
        ))}
      </div>
    </div>
  );
}
