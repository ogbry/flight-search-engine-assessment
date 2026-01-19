import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  filterStateAtom,
  sortOptionAtom,
  filteredFlightsSelector,
  availableAirlinesSelector,
  priceRangeSelector,
  priceStatsSelector,
  flightResultsAtom,
} from '../atoms/flightAtoms';
import type { FilterState } from '../types/flight';
import { getDefaultFilters } from '../utils/filterUtils';

export function useFilters() {
  const [filters, setFilters] = useRecoilState(filterStateAtom);
  const [sortOption, setSortOption] = useRecoilState(sortOptionAtom);
  const filteredFlights = useRecoilValue(filteredFlightsSelector);
  const availableAirlines = useRecoilValue(availableAirlinesSelector);
  const priceRange = useRecoilValue(priceRangeSelector);
  const priceStats = useRecoilValue(priceStatsSelector);
  const allFlights = useRecoilValue(flightResultsAtom);

  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      setFilters((prev) => ({ ...prev, ...updates }));
    },
    [setFilters]
  );

  const toggleStopFilter = useCallback(
    (stops: number) => {
      setFilters((prev) => {
        const newStops = prev.stops.includes(stops)
          ? prev.stops.filter((s) => s !== stops)
          : [...prev.stops, stops];
        return { ...prev, stops: newStops };
      });
    },
    [setFilters]
  );

  const toggleAirlineFilter = useCallback(
    (airlineCode: string) => {
      setFilters((prev) => {
        const newAirlines = prev.airlines.includes(airlineCode)
          ? prev.airlines.filter((a) => a !== airlineCode)
          : [...prev.airlines, airlineCode];
        return { ...prev, airlines: newAirlines };
      });
    },
    [setFilters]
  );

  const setPriceRange = useCallback(
    (range: [number, number]) => {
      setFilters((prev) => ({ ...prev, priceRange: range }));
    },
    [setFilters]
  );

  const setDepartureTimeRange = useCallback(
    (range: [number, number]) => {
      setFilters((prev) => ({ ...prev, departureTimeRange: range }));
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters(getDefaultFilters(allFlights));
  }, [setFilters, allFlights]);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.stops.length > 0 ||
      filters.airlines.length > 0 ||
      filters.departureTimeRange[0] > 0 ||
      filters.departureTimeRange[1] < 24 ||
      filters.priceRange[0] > priceRange[0] ||
      filters.priceRange[1] < priceRange[1]
    );
  }, [filters, priceRange]);

  return {
    filters,
    sortOption,
    setSortOption,
    filteredFlights,
    availableAirlines,
    priceRange,
    priceStats,
    updateFilters,
    toggleStopFilter,
    toggleAirlineFilter,
    setPriceRange,
    setDepartureTimeRange,
    resetFilters,
    hasActiveFilters,
  };
}
