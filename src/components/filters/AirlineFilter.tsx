import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFilters } from '../../hooks/useFilters';
import { useRecoilValue } from 'recoil';
import { flightResultsAtom } from '../../atoms/flightAtoms';
import { getAirlinesFromOffer } from '../../utils/filterUtils';

export function AirlineFilter() {
  const { filters, availableAirlines, toggleAirlineFilter } = useFilters();
  const [showAll, setShowAll] = useState(false);
  const flights = useRecoilValue(flightResultsAtom);

  // Count flights by airline
  const airlineCounts = flights.reduce((acc, flight) => {
    const airlines = getAirlinesFromOffer(flight);
    airlines.forEach((code) => {
      acc[code] = (acc[code] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const displayedAirlines = showAll
    ? availableAirlines
    : availableAirlines.slice(0, 5);

  if (availableAirlines.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Airlines</h3>
      <div className="space-y-2">
        {displayedAirlines.map((airline) => (
          <label
            key={airline.code}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={filters.airlines.includes(airline.code)}
              onChange={() => toggleAirlineFilter(airline.code)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900 truncate">
              {airline.name}
            </span>
            <span className="text-xs text-gray-400">
              {airlineCounts[airline.code] || 0}
            </span>
          </label>
        ))}
      </div>

      {availableAirlines.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          {showAll ? (
            <>
              Show less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show all {availableAirlines.length} <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
