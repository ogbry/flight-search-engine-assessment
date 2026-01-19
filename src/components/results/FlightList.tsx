import { useRecoilValue } from 'recoil';
import {
  filteredFlightsSelector,
  isLoadingAtom,
  errorAtom,
  hasSearchedAtom,
  flightResultsAtom,
} from '../../atoms/flightAtoms';
import { FlightCard } from './FlightCard';
import { EmptyState } from '../common/EmptyState';
import { FlightListSkeleton } from '../common/Skeletons';
import { useFilters } from '../../hooks/useFilters';
import { useFlightSearch } from '../../hooks/useFlightSearch';

export function FlightList() {
  const flights = useRecoilValue(filteredFlightsSelector);
  const allFlights = useRecoilValue(flightResultsAtom);
  const isLoading = useRecoilValue(isLoadingAtom);
  const error = useRecoilValue(errorAtom);
  const hasSearched = useRecoilValue(hasSearchedAtom);
  const { resetFilters } = useFilters();
  const { search } = useFlightSearch();

  if (isLoading) {
    return <FlightListSkeleton count={3} />;
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        errorMessage={error}
        onRetry={() => search()}
      />
    );
  }

  if (!hasSearched) {
    return <EmptyState type="initial" />;
  }

  if (flights.length === 0 && allFlights.length === 0) {
    return <EmptyState type="no-results" />;
  }

  if (flights.length === 0 && allFlights.length > 0) {
    return (
      <EmptyState
        type="no-filter-results"
        totalFlights={allFlights.length}
        onClearFilters={resetFilters}
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-900">{flights.length}</span> of{' '}
        <span className="font-medium text-gray-900">{allFlights.length}</span> flights
      </p>
      {flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} />
      ))}
    </div>
  );
}
