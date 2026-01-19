import { useFilters } from '../../hooks/useFilters';

const timeLabels: Record<number, string> = {
  0: '12am',
  3: '3am',
  6: '6am',
  9: '9am',
  12: '12pm',
  15: '3pm',
  18: '6pm',
  21: '9pm',
  24: '12am',
};

export function TimeFilter() {
  const { filters, setDepartureTimeRange } = useFilters();

  const [minTime, maxTime] = filters.departureTimeRange;

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= maxTime) {
      setDepartureTimeRange([value, maxTime]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= minTime) {
      setDepartureTimeRange([minTime, value]);
    }
  };

  const formatTime = (hour: number) => {
    if (hour === 0 || hour === 24) return '12:00 AM';
    if (hour === 12) return '12:00 PM';
    if (hour < 12) return `${hour}:00 AM`;
    return `${hour - 12}:00 PM`;
  };

  const leftPosition = (minTime / 24) * 100;
  const rightPosition = (maxTime / 24) * 100;

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Departure Time</h3>
      <div className="flex justify-between text-sm text-gray-600 mb-2">
        <span>{formatTime(minTime)}</span>
        <span>{formatTime(maxTime)}</span>
      </div>

      {/* Custom Range Slider */}
      <div className="relative h-2 bg-gray-200 rounded-full">
        <div
          className="absolute h-2 bg-primary-500 rounded-full"
          style={{
            left: `${leftPosition}%`,
            width: `${rightPosition - leftPosition}%`,
          }}
        />
        <input
          type="range"
          min={0}
          max={24}
          value={minTime}
          onChange={handleMinChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
        />
        <input
          type="range"
          min={0}
          max={24}
          value={maxTime}
          onChange={handleMaxChange}
          className="absolute w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-sm"
        />
      </div>

      {/* Time markers */}
      <div className="flex justify-between mt-2">
        {[0, 6, 12, 18, 24].map((hour) => (
          <span key={hour} className="text-xs text-gray-400">
            {timeLabels[hour]}
          </span>
        ))}
      </div>
    </div>
  );
}
