import { useFilters } from '../../hooks/useFilters';
import { useRecoilValue } from 'recoil';
import { flightResultsAtom } from '../../atoms/flightAtoms';
import { getStopsCount } from '../../utils/filterUtils';

export function StopsFilter() {
  const { filters, toggleStopFilter } = useFilters();
  const flights = useRecoilValue(flightResultsAtom);

  // Count flights by stops
  const stopCounts = flights.reduce((acc, flight) => {
    const stops = getStopsCount(flight);
    const key = stops >= 2 ? 2 : stops;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const stopOptions = [
    { value: 0, label: 'Nonstop', count: stopCounts[0] || 0 },
    { value: 1, label: '1 stop', count: stopCounts[1] || 0 },
    { value: 2, label: '2+ stops', count: stopCounts[2] || 0 },
  ];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Stops</h3>
      <div className="space-y-2">
        {stopOptions.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={filters.stops.includes(option.value)}
              onChange={() => toggleStopFilter(option.value)}
              className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="flex-1 text-sm text-gray-700 group-hover:text-gray-900">
              {option.label}
            </span>
            <span className="text-xs text-gray-400">{option.count}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
