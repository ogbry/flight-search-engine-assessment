import { useRef } from 'react';
import { Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface DateInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
}

export function DateInput({ label, value, onChange, min }: DateInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.showPicker();
  };

  // Format the date for display
  const getFormattedDate = () => {
    if (!value) return '';
    try {
      const date = parseISO(value);
      return format(date, 'MMMM d, yyyy'); // Full format: "January 23, 2026"
    } catch {
      return value;
    }
  };

  const getShortFormattedDate = () => {
    if (!value) return '';
    try {
      const date = parseISO(value);
      return format(date, 'MMM d, yyyy'); // Short format: "Jan 23, 2026"
    } catch {
      return value;
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {/* Hidden native date input */}
        <input
          ref={inputRef}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />

        {/* Custom display */}
        <div
          onClick={handleClick}
          className="w-full px-3 py-2.5 pl-10 border border-gray-300 rounded-lg bg-white text-sm cursor-pointer hover:border-gray-400 transition-colors flex items-center min-h-[42px]"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>

          {value ? (
            <>
              {/* Full month name on xl screens */}
              <span className="hidden xl:inline text-gray-900">
                {getFormattedDate()}
              </span>
              {/* Short month name on lg screens */}
              <span className="hidden lg:inline xl:hidden text-gray-900">
                {getShortFormattedDate()}
              </span>
              {/* Default browser format on smaller screens */}
              <span className="lg:hidden text-gray-900">
                {getShortFormattedDate()}
              </span>
            </>
          ) : (
            <span className="text-gray-400">Select date</span>
          )}
        </div>
      </div>
    </div>
  );
}
