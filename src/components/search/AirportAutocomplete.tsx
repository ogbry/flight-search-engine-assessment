import { useState, useEffect, useRef } from 'react';
import { MapPin, Plane } from 'lucide-react';
import type { Airport } from '../../types/flight';
import { amadeusAPI } from '../../api/amadeus';
import { useDebounce } from '../../hooks/useDebounce';

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: Airport | null;
  onChange: (airport: Airport | null) => void;
  icon?: 'origin' | 'destination';
}

export function AirportAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  icon = 'origin',
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      setQuery(`${value.cityName} (${value.iataCode})`);
    }
  }, [value]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      // Don't search if query matches current value
      if (value && query === `${value.cityName} (${value.iataCode})`) {
        return;
      }

      setIsLoading(true);
      try {
        const results = await amadeusAPI.searchAirports(debouncedQuery);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (error) {
        console.error('Failed to fetch airports:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery, value, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airport: Airport) => {
    onChange(airport);
    setQuery(`${airport.cityName} (${airport.iataCode})`);
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery === '') {
      onChange(null);
    }
  };

  const handleFocus = () => {
    if (suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className="relative flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon === 'origin' ? (
            <Plane className="h-5 w-5 text-gray-400 rotate-45" />
          ) : (
            <MapPin className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className="input-field pl-10"
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {suggestions.map((airport) => (
            <li
              key={`${airport.iataCode}-${airport.name}`}
              onClick={() => handleSelect(airport)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary-600 bg-primary-50 px-2 py-1 rounded">
                  {airport.iataCode}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {airport.cityName}
                  </p>
                  <p className="text-xs text-gray-500">{airport.name}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
