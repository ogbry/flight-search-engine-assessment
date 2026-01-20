import { MapPin } from 'lucide-react';
import { useFlightSearch } from '../../hooks/useFlightSearch';
import type { Airport } from '../../types/flight';

interface Destination {
  city: string;
  country: string;
  airport: Airport;
  image: string;
  tagline: string;
}

const popularDestinations: Destination[] = [
  {
    city: 'Paris',
    country: 'France',
    airport: {
      iataCode: 'CDG',
      name: 'Charles de Gaulle Airport',
      cityName: 'Paris',
      countryCode: 'FR',
    },
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop',
    tagline: 'City of Lights',
  },
  {
    city: 'Tokyo',
    country: 'Japan',
    airport: {
      iataCode: 'NRT',
      name: 'Narita International Airport',
      cityName: 'Tokyo',
      countryCode: 'JP',
    },
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop',
    tagline: 'Where tradition meets future',
  },
  {
    city: 'New York',
    country: 'USA',
    airport: {
      iataCode: 'JFK',
      name: 'John F. Kennedy International Airport',
      cityName: 'New York',
      countryCode: 'US',
    },
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop',
    tagline: 'The city that never sleeps',
  },
  {
    city: 'London',
    country: 'UK',
    airport: {
      iataCode: 'LHR',
      name: 'Heathrow Airport',
      cityName: 'London',
      countryCode: 'GB',
    },
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=300&fit=crop',
    tagline: 'History and culture',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    airport: {
      iataCode: 'DXB',
      name: 'Dubai International Airport',
      cityName: 'Dubai',
      countryCode: 'AE',
    },
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop',
    tagline: 'Luxury in the desert',
  },
  {
    city: 'Sydney',
    country: 'Australia',
    airport: {
      iataCode: 'SYD',
      name: 'Sydney Airport',
      cityName: 'Sydney',
      countryCode: 'AU',
    },
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop',
    tagline: 'Harbor city beauty',
  },
];

interface PopularDestinationsProps {
  onSelect?: () => void;
}

export function PopularDestinations({ onSelect }: PopularDestinationsProps) {
  const { updateSearchParams } = useFlightSearch();

  const handleSelect = (destination: Destination) => {
    updateSearchParams({
      destination: destination.airport,
    });
    onSelect?.();
  };

  return (
    <div className="mt-8">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary-500" />
        Popular Destinations
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {popularDestinations.map((dest) => (
          <button
            key={dest.airport.iataCode}
            onClick={() => handleSelect(dest)}
            className="group relative overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[3/4] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {/* Background Image */}
            <img
              src={dest.image}
              alt={dest.city}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-3 flex flex-col justify-end text-white text-left">
              <div className="transform transition-transform duration-300 group-hover:translate-y-[-4px]">
                <p className="font-bold text-sm sm:text-base">{dest.city}</p>
                <p className="text-xs text-white/80">{dest.country}</p>
                <p className="text-[10px] sm:text-xs text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {dest.tagline}
                </p>
              </div>
            </div>

            {/* Airport Code Badge */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold text-gray-900">
              {dest.airport.iataCode}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
