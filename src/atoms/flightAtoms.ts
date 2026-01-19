import { atom, selector } from 'recoil';
import type {
  SearchParams,
  FlightOffer,
  FilterState,
  SortOption,
} from '../types/flight';
import {
  filterFlights,
  getPriceRange,
  getUniqueAirlines,
  getPriceDistribution,
} from '../utils/filterUtils';
import { format, addDays } from 'date-fns';

// Default search parameters
const defaultSearchParams: SearchParams = {
  origin: null,
  destination: null,
  departureDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
  returnDate: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
  adults: 1,
  children: 0,
  infants: 0,
  cabinClass: 'ECONOMY',
  tripType: 'round-trip',
};

// Search params atom
export const searchParamsAtom = atom<SearchParams>({
  key: 'searchParams',
  default: defaultSearchParams,
});

// Flight results atom
export const flightResultsAtom = atom<FlightOffer[]>({
  key: 'flightResults',
  default: [],
});

// Carrier dictionary atom
export const carrierDictionaryAtom = atom<Record<string, string>>({
  key: 'carrierDictionary',
  default: {},
});

// Loading state atom
export const isLoadingAtom = atom<boolean>({
  key: 'isLoading',
  default: false,
});

// Error state atom
export const errorAtom = atom<string | null>({
  key: 'error',
  default: null,
});

// Filter state atom
export const filterStateAtom = atom<FilterState>({
  key: 'filterState',
  default: {
    stops: [],
    priceRange: [0, 10000],
    airlines: [],
    departureTimeRange: [0, 24],
    arrivalTimeRange: [0, 24],
  },
});

// Sort option atom
export const sortOptionAtom = atom<SortOption>({
  key: 'sortOption',
  default: 'price-asc',
});

// Price range from results selector
export const priceRangeSelector = selector({
  key: 'priceRange',
  get: ({ get }) => {
    const flights = get(flightResultsAtom);
    return getPriceRange(flights);
  },
});

// Available airlines selector
export const availableAirlinesSelector = selector({
  key: 'availableAirlines',
  get: ({ get }) => {
    const flights = get(flightResultsAtom);
    const carriers = get(carrierDictionaryAtom);
    return getUniqueAirlines(flights, carriers);
  },
});

// Filtered flights selector
export const filteredFlightsSelector = selector({
  key: 'filteredFlights',
  get: ({ get }) => {
    const flights = get(flightResultsAtom);
    const filters = get(filterStateAtom);
    const sortOption = get(sortOptionAtom);

    const filtered = filterFlights(flights, filters);

    // Sort flights
    return [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return parseFloat(a.price.grandTotal) - parseFloat(b.price.grandTotal);
        case 'price-desc':
          return parseFloat(b.price.grandTotal) - parseFloat(a.price.grandTotal);
        case 'duration-asc': {
          const durationA = a.itineraries[0].duration;
          const durationB = b.itineraries[0].duration;
          return durationA.localeCompare(durationB);
        }
        case 'departure-asc': {
          const depA = a.itineraries[0].segments[0].departure.at;
          const depB = b.itineraries[0].segments[0].departure.at;
          return depA.localeCompare(depB);
        }
        case 'departure-desc': {
          const depA = a.itineraries[0].segments[0].departure.at;
          const depB = b.itineraries[0].segments[0].departure.at;
          return depB.localeCompare(depA);
        }
        default:
          return 0;
      }
    });
  },
});

// Price distribution selector (for graph)
export const priceDistributionSelector = selector({
  key: 'priceDistribution',
  get: ({ get }) => {
    const flights = get(filteredFlightsSelector);
    return getPriceDistribution(flights, 8);
  },
});

// Price statistics selector
export const priceStatsSelector = selector({
  key: 'priceStats',
  get: ({ get }) => {
    const flights = get(filteredFlightsSelector);
    if (flights.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const prices = flights.map((f) => parseFloat(f.price.grandTotal));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
      count: flights.length,
    };
  },
});

// Has searched atom
export const hasSearchedAtom = atom<boolean>({
  key: 'hasSearched',
  default: false,
});
