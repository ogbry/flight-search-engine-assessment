// Search Parameters
export interface SearchParams {
  origin: Airport | null;
  destination: Airport | null;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
  infants: number;
  cabinClass: CabinClass;
  tripType: TripType;
}

export type CabinClass = 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
export type TripType = 'one-way' | 'round-trip';

// Airport
export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
}

// Flight Offer from Amadeus API
export interface FlightOffer {
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: Itinerary[];
  price: Price;
  pricingOptions: PricingOptions;
  validatingAirlineCodes: string[];
  travelerPricings: TravelerPricing[];
}

export interface Itinerary {
  duration: string;
  segments: Segment[];
}

export interface Segment {
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  carrierCode: string;
  number: string;
  aircraft: { code: string };
  operating?: { carrierCode: string };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

export interface FlightEndpoint {
  iataCode: string;
  terminal?: string;
  at: string;
}

export interface Price {
  currency: string;
  total: string;
  base: string;
  fees?: Fee[];
  grandTotal: string;
}

export interface Fee {
  amount: string;
  type: string;
}

export interface PricingOptions {
  fareType: string[];
  includedCheckedBagsOnly: boolean;
}

export interface TravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  price: {
    currency: string;
    total: string;
    base: string;
  };
  fareDetailsBySegment: FareDetails[];
}

export interface FareDetails {
  segmentId: string;
  cabin: string;
  fareBasis: string;
  class: string;
  includedCheckedBags?: {
    weight?: number;
    weightUnit?: string;
    quantity?: number;
  };
}

// Filters
export interface FilterState {
  stops: number[];
  priceRange: [number, number];
  airlines: string[];
  departureTimeRange: [number, number];
  arrivalTimeRange: [number, number];
}

// Airline Info
export interface Airline {
  code: string;
  name: string;
}

// API Response Types
export interface FlightSearchResponse {
  meta: {
    count: number;
    links: { self: string };
  };
  data: FlightOffer[];
  dictionaries?: {
    carriers?: Record<string, string>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    locations?: Record<string, {
      cityCode: string;
      countryCode: string;
    }>;
  };
}

export interface AirportSearchResponse {
  meta: { count: number };
  data: AirportData[];
}

export interface AirportData {
  type: string;
  subType: string;
  name: string;
  detailedName: string;
  id: string;
  self: { href: string; methods: string[] };
  iataCode: string;
  address: {
    cityName: string;
    cityCode: string;
    countryName: string;
    countryCode: string;
    regionCode: string;
  };
}

// Price Graph Data
export interface PriceDataPoint {
  price: number;
  count: number;
  range: string;
}

// Sort Options
export type SortOption = 'price-asc' | 'price-desc' | 'duration-asc' | 'departure-asc' | 'departure-desc';
