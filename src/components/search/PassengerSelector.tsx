import { useState, useRef, useEffect } from "react";
import { Users, Plus, Minus } from "lucide-react";

interface PassengerSelectorProps {
  adults: number;
  children: number;
  infants: number;
  onChange: (passengers: {
    adults: number;
    children: number;
    infants: number;
  }) => void;
}

export function PassengerSelector({
  adults,
  children,
  infants,
  onChange,
}: PassengerSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPassengers = adults + children + infants;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateCount = (
    type: "adults" | "children" | "infants",
    delta: number
  ) => {
    const newValue = { adults, children, infants };
    newValue[type] = Math.max(
      type === "adults" ? 1 : 0,
      newValue[type] + delta
    );

    // Infants cannot exceed adults
    if (type === "infants" && newValue.infants > newValue.adults) {
      return;
    }

    // Max 9 passengers
    if (newValue.adults + newValue.children + newValue.infants > 9) {
      return;
    }

    onChange(newValue);
  };

  const PassengerRow = ({
    label,
    description,
    count,
    type,
    min,
  }: {
    label: string;
    description: string;
    count: number;
    type: "adults" | "children" | "infants";
    min: number;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => updateCount(type, -1)}
          disabled={count <= min}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-6 text-center font-medium">{count}</span>
        <button
          type="button"
          onClick={() => updateCount(type, 1)}
          disabled={totalPassengers >= 9}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Passengers
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="input-field flex items-center gap-2 text-left"
      >
        <Users className="w-5 h-5 text-gray-400" />
        <span>
          {totalPassengers} {totalPassengers === 1 ? "Passenger" : "Passengers"}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-72 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4">
          <PassengerRow
            label="Adults"
            description="Age 12+"
            count={adults}
            type="adults"
            min={1}
          />
          <div className="border-t border-gray-100">
            <PassengerRow
              label="Children"
              description="Age 2-11"
              count={children}
              type="children"
              min={0}
            />
          </div>
          <div className="border-t border-gray-100">
            <PassengerRow
              label="Infants"
              description="Under 2"
              count={infants}
              type="infants"
              min={0}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full mt-3 btn-primary"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
