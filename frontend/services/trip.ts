/**
 * Trip service for budget calculations
 */

import { api } from './api';

export interface TripCraftParams {
  startDate: string;
  numberOfDays: number;
  adults: number;
  children?: number;
  includeRestaurant?: boolean;
  includeVehicle?: boolean;
}

export interface BudgetBreakdown {
  stay: number;
  restaurant: number;
  vehicle: number;
}

export interface BudgetData {
  type: 'minimum' | 'maximum' | 'standard';
  totalBudget: number;
  avgBudgetPerPerson: number;
  breakdown: BudgetBreakdown;
}

export interface TripCraftResponse {
  data: BudgetData[];
  meta: {
    query: TripCraftParams;
  };
}

export const tripService = {
  /**
   * Get budget estimation for a trip
   */
  async craftTrip(params: TripCraftParams): Promise<TripCraftResponse> {
    const queryParams = {
      startDate: params.startDate,
      numberOfDays: params.numberOfDays,
      adults: params.adults,
      children: params.children || 0,
      includeRestaurant: params.includeRestaurant || false,
      includeVehicle: params.includeVehicle || false,
    };

    return api.get<TripCraftResponse>('/trip/craft', queryParams);
  },
};

export default tripService;
