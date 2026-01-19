import { ArrowRightLeft, ArrowDownUp, Calendar, Search } from 'lucide-react';
import { useFlightSearch } from '../../hooks/useFlightSearch';
import { AirportAutocomplete } from './AirportAutocomplete';
import { PassengerSelector } from './PassengerSelector';
import type { CabinClass, TripType } from '../../types/flight';

interface SearchFormProps {
  onSearch?: () => void;
}

export function SearchForm({ onSearch }: SearchFormProps) {
  const { searchParams, updateSearchParams, search, isLoading } = useFlightSearch();

  const handleSwapAirports = () => {
    const { origin, destination } = searchParams;
    updateSearchParams({
      origin: destination,
      destination: origin,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await search();
    onSearch?.();
  };

  const tripTypes: { value: TripType; label: string }[] = [
    { value: 'round-trip', label: 'Round trip' },
    { value: 'one-way', label: 'One way' },
  ];

  const cabinClasses: { value: CabinClass; label: string }[] = [
    { value: 'ECONOMY', label: 'Economy' },
    { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
    { value: 'BUSINESS', label: 'Business' },
    { value: 'FIRST', label: 'First' },
  ];

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Trip Type and Cabin Class */}
      <div className="flex flex-wrap gap-2 sm:gap-4 mb-4">
        <div className="flex gap-1 sm:gap-2">
          {tripTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => updateSearchParams({ tripType: type.value })}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                searchParams.tripType === type.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <select
          value={searchParams.cabinClass}
          onChange={(e) =>
            updateSearchParams({ cabinClass: e.target.value as CabinClass })
          }
          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full bg-gray-100 text-gray-700 border-0 focus:ring-2 focus:ring-primary-500 cursor-pointer"
        >
          {cabinClasses.map((cabin) => (
            <option key={cabin.value} value={cabin.value}>
              {cabin.label}
            </option>
          ))}
        </select>
      </div>

      {/* Main Search Fields */}
      <div className="space-y-4">
        {/* Origin & Destination - Stack on mobile, side by side on larger screens */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-2">
            <AirportAutocomplete
              label="From"
              placeholder="Where from?"
              value={searchParams.origin}
              onChange={(airport) => updateSearchParams({ origin: airport })}
              icon="origin"
            />

            <AirportAutocomplete
              label="To"
              placeholder="Where to?"
              value={searchParams.destination}
              onChange={(airport) => updateSearchParams({ destination: airport })}
              icon="destination"
            />
          </div>

          {/* Swap button - positioned between fields */}
          <button
            type="button"
            onClick={handleSwapAirports}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm hidden md:flex"
            title="Swap airports"
          >
            <ArrowRightLeft className="w-4 h-4 text-gray-500" />
          </button>

          {/* Mobile swap button */}
          <button
            type="button"
            onClick={handleSwapAirports}
            className="md:hidden absolute right-2 top-[calc(50%-8px)] z-10 p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
            title="Swap airports"
          >
            <ArrowDownUp className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Dates - Stacked vertically, full width */}
        <div className="space-y-4">
          {/* Departure Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Departure
            </label>
            <div className="relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={searchParams.departureDate}
                onChange={(e) =>
                  updateSearchParams({ departureDate: e.target.value })
                }
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm min-w-0"
              />
            </div>
          </div>

          {/* Return Date - Only show for round-trip */}
          {searchParams.tripType === 'round-trip' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Return
              </label>
              <div className="relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={searchParams.returnDate || ''}
                  onChange={(e) =>
                    updateSearchParams({ returnDate: e.target.value })
                  }
                  min={searchParams.departureDate}
                  className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm min-w-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Passengers and Search Button */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Passengers */}
          <PassengerSelector
            adults={searchParams.adults}
            children={searchParams.children}
            infants={searchParams.infants}
            onChange={(passengers) => updateSearchParams(passengers)}
          />

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="hidden sm:inline">Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
