import { useRecoilValue } from 'recoil';
import { Plane, AlertCircle } from 'lucide-react';
import {
  filteredFlightsSelector,
  isLoadingAtom,
  errorAtom,
  hasSearchedAtom,
  flightResultsAtom,
} from '../../atoms/flightAtoms';
import { FlightCard } from './FlightCard';

function LoadingSkeleton() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
              <div className="flex items-center gap-4">
                <div className="h-6 bg-gray-200 rounded w-16" />
                <div className="flex-1 h-px bg-gray-200" />
                <div className="h-6 bg-gray-200 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:min-w-[140px] lg:pl-6 lg:border-l border-gray-100">
          <div className="h-8 bg-gray-200 rounded w-24 mb-2" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card p-12 text-center">
      <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        No flights found
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        We couldn't find any flights matching your search criteria. Try adjusting
        your dates, filters, or search for a different destination.
      </p>
    </div>
  );
}

function InitialState() {
  return (
    <div className="card p-12 text-center">
      <Plane className="w-16 h-16 text-primary-200 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Search for flights
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">
        Enter your travel details above to find the best flight deals.
      </p>
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="card p-12 text-center">
      <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-500 max-w-md mx-auto">{message}</p>
    </div>
  );
}

export function FlightList() {
  const flights = useRecoilValue(filteredFlightsSelector);
  const allFlights = useRecoilValue(flightResultsAtom);
  const isLoading = useRecoilValue(isLoadingAtom);
  const error = useRecoilValue(errorAtom);
  const hasSearched = useRecoilValue(hasSearchedAtom);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!hasSearched) {
    return <InitialState />;
  }

  if (flights.length === 0 && allFlights.length === 0) {
    return <EmptyState />;
  }

  if (flights.length === 0 && allFlights.length > 0) {
    return (
      <div className="card p-12 text-center">
        <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No flights match your filters
        </h3>
        <p className="text-gray-500 max-w-md mx-auto">
          {allFlights.length} flights found, but none match your current filters.
          Try adjusting or clearing your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Showing {flights.length} of {allFlights.length} flights
      </p>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}
