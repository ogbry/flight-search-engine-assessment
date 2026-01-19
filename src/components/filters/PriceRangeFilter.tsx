import { useState, useEffect } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { formatPrice } from '../../utils/formatters';

export function PriceRangeFilter() {
  const { filters, priceRange, setPriceRange } = useFilters();
  const [localMin, setLocalMin] = useState(filters.priceRange[0]);
  const [localMax, setLocalMax] = useState(filters.priceRange[1]);

  const [minBound, maxBound] = priceRange;

  useEffect(() => {
    setLocalMin(filters.priceRange[0]);
    setLocalMax(filters.priceRange[1]);
  }, [filters.priceRange]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMin(value);
    if (value <= localMax) {
      setPriceRange([value, localMax]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMax(value);
    if (value >= localMin) {
      setPriceRange([localMin, value]);
    }
  };

  const rangeWidth = maxBound - minBound || 1;
  const leftPosition = ((localMin - minBound) / rangeWidth) * 100;
  const rightPosition = ((localMax - minBound) / rangeWidth) * 100;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>

      {/* Price Labels */}
      <div className="flex justify-between text-sm font-medium text-gray-900 mb-4">
        <span>{formatPrice(localMin)}</span>
        <span>{formatPrice(localMax)}</span>
      </div>

      {/* Dual Range Slider */}
      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Active range highlight */}
        <div
          className="absolute h-2 bg-primary-500 rounded-full"
          style={{
            left: `${leftPosition}%`,
            width: `${rightPosition - leftPosition}%`,
          }}
        />

        {/* Min slider */}
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={localMin}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:border-primary-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
        />

        {/* Max slider */}
        <input
          type="range"
          min={minBound}
          max={maxBound}
          value={localMax}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:border-primary-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary-500 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
        />
      </div>

      {/* Min/Max bounds labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-2">
        <span>{formatPrice(minBound)}</span>
        <span>{formatPrice(maxBound)}</span>
      </div>
    </div>
  );
}
