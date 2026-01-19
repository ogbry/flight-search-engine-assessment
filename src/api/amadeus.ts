import axios, { type AxiosInstance } from 'axios';
import type {
  FlightSearchResponse,
  AirportSearchResponse,
  SearchParams,
  Airport,
} from '../types/flight';

const BASE_URL = import.meta.env.VITE_AMADEUS_BASE_URL || 'https://test.api.amadeus.com';
const API_KEY = import.meta.env.VITE_AMADEUS_API_KEY;
const API_SECRET = import.meta.env.VITE_AMADEUS_API_SECRET;

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class AmadeusAPI {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!API_KEY || !API_SECRET) {
      throw new Error(
        'Amadeus API credentials not configured. Please set VITE_AMADEUS_API_KEY and VITE_AMADEUS_API_SECRET in your .env file.'
      );
    }

    try {
      const response = await axios.post<TokenResponse>(
        `${BASE_URL}/v1/security/oauth2/token`,
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: API_KEY,
          client_secret: API_SECRET,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

      return this.accessToken;
    } catch (error) {
      console.error('Failed to get access token:', error);
      throw new Error('Failed to authenticate with Amadeus API');
    }
  }

  private async request<T>(
    method: 'get' | 'post',
    endpoint: string,
    params?: Record<string, unknown>,
    data?: unknown
  ): Promise<T> {
    const token = await this.getAccessToken();

    const response = await this.client.request<T>({
      method,
      url: endpoint,
      params,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  async searchAirports(keyword: string): Promise<Airport[]> {
    if (!keyword || keyword.length < 2) return [];

    try {
      const response = await this.request<AirportSearchResponse>(
        'get',
        '/v1/reference-data/locations',
        {
          keyword: keyword.toUpperCase(),
          subType: 'AIRPORT,CITY',
          'page[limit]': 10,
        }
      );

      return response.data.map((item) => ({
        iataCode: item.iataCode,
        name: item.name,
        cityName: item.address.cityName,
        countryCode: item.address.countryCode,
      }));
    } catch (error) {
      console.error('Airport search error:', error);
      return [];
    }
  }

  async searchFlights(params: SearchParams): Promise<FlightSearchResponse> {
    if (!params.origin || !params.destination) {
      throw new Error('Origin and destination are required');
    }

    const searchParams: Record<string, unknown> = {
      originLocationCode: params.origin.iataCode,
      destinationLocationCode: params.destination.iataCode,
      departureDate: params.departureDate,
      adults: params.adults,
      currencyCode: 'USD',
      max: 50,
    };

    if (params.returnDate && params.tripType === 'round-trip') {
      searchParams.returnDate = params.returnDate;
    }

    if (params.children > 0) {
      searchParams.children = params.children;
    }

    if (params.infants > 0) {
      searchParams.infants = params.infants;
    }

    if (params.cabinClass !== 'ECONOMY') {
      searchParams.travelClass = params.cabinClass;
    }

    try {
      const response = await this.request<FlightSearchResponse>(
        'get',
        '/v2/shopping/flight-offers',
        searchParams
      );

      return response;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.errors?.[0]?.detail || error.message;
        throw new Error(`Flight search failed: ${message}`);
      }
      throw error;
    }
  }
}

export const amadeusAPI = new AmadeusAPI();
