import { useState } from 'react';
import { ChevronDown, ChevronUp, Plane, Clock } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import type { FlightOffer, Itinerary } from '../../types/flight';
import { carrierDictionaryAtom } from '../../atoms/flightAtoms';
import { formatPrice, formatTime, formatDuration, formatStops, getLayoverDuration } from '../../utils/formatters';

interface FlightCardProps {
  flight: FlightOffer;
}

function ItineraryDisplay({
  itinerary,
  carrierDictionary,
  label,
}: {
  itinerary: Itinerary;
  carrierDictionary: Record<string, string>;
  label: string;
}) {
  const firstSegment = itinerary.segments[0];
  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
  const stops = itinerary.segments.length - 1;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 py-3">
      {/* Airline Logo Placeholder */}
      <div className="flex items-center gap-3 sm:block">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-gray-600">
            {firstSegment.carrierCode}
          </span>
        </div>
        <div className="sm:hidden">
          <span className="text-xs text-gray-500 font-medium">{label}</span>
          <p className="text-xs text-gray-400">
            {carrierDictionary[firstSegment.carrierCode] || firstSegment.carrierCode}
          </p>
        </div>
      </div>

      {/* Flight Times */}
      <div className="flex-1 min-w-0">
        <div className="hidden sm:flex items-center gap-2 mb-1">
          <span className="text-xs text-gray-500 font-medium">{label}</span>
          <span className="text-xs text-gray-400">
            {carrierDictionary[firstSegment.carrierCode] || firstSegment.carrierCode}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-center min-w-[50px]">
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {formatTime(firstSegment.departure.at)}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">{firstSegment.departure.iataCode}</p>
          </div>

          <div className="flex-1 flex flex-col items-center min-w-[80px] sm:min-w-[100px]">
            <span className="text-[10px] sm:text-xs text-gray-500 mb-1">
              {formatDuration(itinerary.duration)}
            </span>
            <div className="w-full flex items-center">
              <div className="h-px bg-gray-300 flex-1" />
              <Plane className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 mx-1" />
              <div className="h-px bg-gray-300 flex-1" />
            </div>
            <span className={`text-[10px] sm:text-xs mt-1 ${stops === 0 ? 'text-green-600' : 'text-orange-600'}`}>
              {formatStops(stops)}
            </span>
          </div>

          <div className="text-center min-w-[50px]">
            <p className="text-base sm:text-lg font-semibold text-gray-900">
              {formatTime(lastSegment.arrival.at)}
            </p>
            <p className="text-xs sm:text-sm text-gray-500">{lastSegment.arrival.iataCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SegmentDetails({
  itinerary,
  carrierDictionary,
}: {
  itinerary: Itinerary;
  carrierDictionary: Record<string, string>;
}) {
  return (
    <div className="space-y-4">
      {itinerary.segments.map((segment, index) => (
        <div key={segment.id}>
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] sm:text-xs font-bold text-gray-600">
                {segment.carrierCode}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-900">
                {carrierDictionary[segment.carrierCode] || segment.carrierCode}{' '}
                {segment.carrierCode}
                {segment.number}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm">
                <div>
                  <p className="font-semibold">{formatTime(segment.departure.at)}</p>
                  <p className="text-gray-500">
                    {segment.departure.iataCode}
                    {segment.departure.terminal && ` T${segment.departure.terminal}`}
                  </p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-gray-400">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{formatDuration(segment.duration)}</span>
                </div>
                <div>
                  <p className="font-semibold">{formatTime(segment.arrival.at)}</p>
                  <p className="text-gray-500">
                    {segment.arrival.iataCode}
                    {segment.arrival.terminal && ` T${segment.arrival.terminal}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Layover */}
          {index < itinerary.segments.length - 1 && (
            <div className="ml-11 sm:ml-14 my-3 py-2 px-3 bg-orange-50 rounded-lg text-xs sm:text-sm text-orange-700">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
              {getLayoverDuration(
                segment.arrival.at,
                itinerary.segments[index + 1].departure.at
              )} at {segment.arrival.iataCode}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function FlightCard({ flight }: FlightCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const carrierDictionary = useRecoilValue(carrierDictionaryAtom);

  const outbound = flight.itineraries[0];
  const inbound = flight.itineraries[1];

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Flight Info */}
          <div className="flex-1 divide-y divide-gray-100">
            <ItineraryDisplay
              itinerary={outbound}
              carrierDictionary={carrierDictionary}
              label="Outbound"
            />
            {inbound && (
              <ItineraryDisplay
                itinerary={inbound}
                carrierDictionary={carrierDictionary}
                label="Return"
              />
            )}
          </div>

          {/* Price */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-3 lg:gap-2 lg:min-w-[140px] pt-3 lg:pt-0 lg:pl-6 border-t lg:border-t-0 lg:border-l border-gray-100">
            <div className="text-left lg:text-right">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatPrice(flight.price.grandTotal, flight.price.currency)}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                {flight.travelerPricings.length > 1
                  ? 'Total'
                  : 'per person'}
              </p>
            </div>
            <button className="btn-primary whitespace-nowrap px-6 sm:px-8">
              Select
            </button>
          </div>
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 w-full flex items-center justify-center gap-2 text-xs sm:text-sm text-primary-600 hover:text-primary-700 py-2"
        >
          {isExpanded ? (
            <>
              Hide details <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              View details <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-6 border-t border-gray-100 pt-4 animate-fade-in">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Plane className="w-4 h-4 rotate-45" />
                Outbound Flight
              </h4>
              <SegmentDetails
                itinerary={outbound}
                carrierDictionary={carrierDictionary}
              />
            </div>
            {inbound && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-sm sm:text-base">
                  <Plane className="w-4 h-4 -rotate-[135deg]" />
                  Return Flight
                </h4>
                <SegmentDetails
                  itinerary={inbound}
                  carrierDictionary={carrierDictionary}
                />
              </div>
            )}
          </div>

          {/* Fare Details */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Fare Details</h4>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <span className="text-gray-500">Cabin:</span>{' '}
                <span className="font-medium capitalize">
                  {flight.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin?.toLowerCase() || 'Economy'}
                </span>
              </div>
              <div className="bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <span className="text-gray-500">Base:</span>{' '}
                <span className="font-medium">
                  {formatPrice(flight.price.base, flight.price.currency)}
                </span>
              </div>
              {flight.price.fees && flight.price.fees.length > 0 && (
                <div className="bg-gray-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                  <span className="text-gray-500">Taxes:</span>{' '}
                  <span className="font-medium">
                    {formatPrice(
                      parseFloat(flight.price.grandTotal) - parseFloat(flight.price.base),
                      flight.price.currency
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
