import { axiosInstance } from '../../../../shared/api/axios-instance';
import type { LocationsQuery, LocationsResponse } from '../model/types';

export async function getLocations(query: LocationsQuery): Promise<LocationsResponse> {
  console.log('[getLocations] Query:', query);

  const params: Record<string, string> = {};

  if (query.userId) params.userId = query.userId;
  if (query.fullName) params.fullName = query.fullName;
  if (query.startDate) params.startDate = query.startDate;
  if (query.endDate) params.endDate = query.endDate;
  if (query.page) params.page = query.page.toString();
  if (query.limit) params.limit = query.limit.toString();
  // Note: sort and order parameters cause 400 errors - backend doesn't support them
  // if (query.sort) params.sort = query.sort;
  // if (query.order) params.order = query.order;

  console.log('[getLocations] Request params:', params);

  const response = await axiosInstance.get<LocationsResponse>('/locations', { params });

  console.log('[getLocations] Response:', {
    total: response.data.total,
    itemsCount: response.data.items?.length,
    page: response.data.page,
    pages: response.data.pages,
    firstItem: response.data.items?.[0]
  });

  return response.data;
}
