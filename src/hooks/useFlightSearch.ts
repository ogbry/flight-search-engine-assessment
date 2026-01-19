import { useCallback } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  searchParamsAtom,
  flightResultsAtom,
  carrierDictionaryAtom,
  isLoadingAtom,
  errorAtom,
  filterStateAtom,
  hasSearchedAtom,
} from '../atoms/flightAtoms';
import { amadeusAPI } from '../api/amadeus';
import type { SearchParams } from '../types/flight';
import { getDefaultFilters } from '../utils/filterUtils';

export function useFlightSearch() {
  const [searchParams, setSearchParams] = useRecoilState(searchParamsAtom);
  const setFlightResults = useSetRecoilState(flightResultsAtom);
  const setCarrierDictionary = useSetRecoilState(carrierDictionaryAtom);
  const [isLoading, setIsLoading] = useRecoilState(isLoadingAtom);
  const setError = useSetRecoilState(errorAtom);
  const setFilterState = useSetRecoilState(filterStateAtom);
  const setHasSearched = useSetRecoilState(hasSearchedAtom);

  const search = useCallback(
    async (params?: SearchParams) => {
      const searchPayload = params || searchParams;

      if (!searchPayload.origin || !searchPayload.destination) {
        setError('Please select origin and destination airports');
        return;
      }

      if (!searchPayload.departureDate) {
        setError('Please select a departure date');
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const response = await amadeusAPI.searchFlights(searchPayload);

        setFlightResults(response.data || []);

        if (response.dictionaries?.carriers) {
          setCarrierDictionary(response.dictionaries.carriers);
        }

        // Reset filters with new price range
        if (response.data && response.data.length > 0) {
          setFilterState(getDefaultFilters(response.data));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An error occurred';
        setError(message);
        setFlightResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      searchParams,
      setFlightResults,
      setCarrierDictionary,
      setIsLoading,
      setError,
      setFilterState,
      setHasSearched,
    ]
  );

  const updateSearchParams = useCallback(
    (updates: Partial<SearchParams>) => {
      setSearchParams((prev) => ({ ...prev, ...updates }));
    },
    [setSearchParams]
  );

  return {
    searchParams,
    setSearchParams,
    updateSearchParams,
    search,
    isLoading,
  };
}
