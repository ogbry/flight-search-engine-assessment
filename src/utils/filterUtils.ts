import type { FlightOffer, FilterState, PriceDataPoint } from '../types/flight';
import { getHourFromISO } from './formatters';

export function getStopsCount(offer: FlightOffer): number {
  return offer.itineraries.reduce((max, itinerary) => {
    const stops = itinerary.segments.length - 1;
    return Math.max(max, stops);
  }, 0);
}

export function getAirlinesFromOffer(offer: FlightOffer): string[] {
  const airlines = new Set<string>();
  offer.itineraries.forEach(itinerary => {
    itinerary.segments.forEach(segment => {
      airlines.add(segment.carrierCode);
    });
  });
  return Array.from(airlines);
}

export function filterFlights(
  flights: FlightOffer[],
  filters: FilterState
): FlightOffer[] {
  return flights.filter(flight => {
    // Filter by stops
    if (filters.stops.length > 0) {
      const stops = getStopsCount(flight);
      const matchesStops = filters.stops.includes(stops) ||
        (stops >= 2 && filters.stops.includes(2));
      if (!matchesStops) return false;
    }

    // Filter by price
    const price = parseFloat(flight.price.grandTotal);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    // Filter by airlines
    if (filters.airlines.length > 0) {
      const flightAirlines = getAirlinesFromOffer(flight);
      const hasMatchingAirline = flightAirlines.some(airline =>
        filters.airlines.includes(airline)
      );
      if (!hasMatchingAirline) return false;
    }

    // Filter by departure time
    const departureHour = getHourFromISO(
      flight.itineraries[0].segments[0].departure.at
    );
    if (
      departureHour < filters.departureTimeRange[0] ||
      departureHour > filters.departureTimeRange[1]
    ) {
      return false;
    }

    return true;
  });
}

export function getUniqueAirlines(
  flights: FlightOffer[],
  carrierDictionary: Record<string, string>
): { code: string; name: string }[] {
  const airlineSet = new Set<string>();

  flights.forEach(flight => {
    flight.itineraries.forEach(itinerary => {
      itinerary.segments.forEach(segment => {
        airlineSet.add(segment.carrierCode);
      });
    });
  });

  return Array.from(airlineSet)
    .map(code => ({
      code,
      name: carrierDictionary[code] || code,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getPriceRange(flights: FlightOffer[]): [number, number] {
  if (flights.length === 0) return [0, 1000];

  const prices = flights.map(f => parseFloat(f.price.grandTotal));
  return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
}

export function getPriceDistribution(
  flights: FlightOffer[],
  bucketCount: number = 10
): PriceDataPoint[] {
  if (flights.length === 0) return [];

  const prices = flights.map(f => parseFloat(f.price.grandTotal));
  const minPrice = Math.floor(Math.min(...prices));
  const maxPrice = Math.ceil(Math.max(...prices));
  const bucketSize = Math.ceil((maxPrice - minPrice) / bucketCount) || 1;

  const buckets: PriceDataPoint[] = [];

  for (let i = 0; i < bucketCount; i++) {
    const rangeStart = minPrice + i * bucketSize;
    const rangeEnd = rangeStart + bucketSize;
    const count = prices.filter(p => p >= rangeStart && p < rangeEnd).length;

    buckets.push({
      price: rangeStart + bucketSize / 2,
      count,
      range: `$${rangeStart} - $${rangeEnd}`,
    });
  }

  return buckets;
}

export function getDefaultFilters(flights: FlightOffer[]): FilterState {
  const [minPrice, maxPrice] = getPriceRange(flights);

  return {
    stops: [],
    priceRange: [minPrice, maxPrice],
    airlines: [],
    departureTimeRange: [0, 24],
    arrivalTimeRange: [0, 24],
  };
}
