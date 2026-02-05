import { axiosInstance } from '../../../../shared/api/axios-instance';
import type { Location, LocationsQuery, LocationsResponse } from '../model/types';

export async function getAllLocations(query?: Omit<LocationsQuery, 'page' | 'limit'>): Promise<Location[]> {
  console.log('[getAllLocations] Query:', query);

  const params: Record<string, string> = {};

  if (query?.userId) params.userId = query.userId;
  if (query?.fullName) params.fullName = query.fullName;
  if (query?.startDate) params.startDate = query.startDate;
  if (query?.endDate) params.endDate = query.endDate;
  // Set very high limit to get all locations
  params.limit = '1000000';

  console.log('[getAllLocations] Request params:', params);

  const response = await axiosInstance.get<LocationsResponse>('/locations', { params });

  console.log('[getAllLocations] Response:', {
    total: response.data.total,
    itemsCount: response.data.items?.length,
  });

  return response.data.items;
}
