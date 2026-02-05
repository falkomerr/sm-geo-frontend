import { axiosInstance } from '../../../../shared/api/axios-instance';
import type { LocationsQuery } from '../model/types';

export async function exportLocationsCsv(query: LocationsQuery): Promise<void> {
  const params: Record<string, string> = {};

  if (query.userId) params.userId = query.userId;
  if (query.fullName) params.fullName = query.fullName;
  if (query.startDate) params.startDate = query.startDate;
  if (query.endDate) params.endDate = query.endDate;
  if (query.sort) params.sort = query.sort;
  if (query.order) params.order = query.order;

  const response = await axiosInstance.get('/locations/export/csv', {
    params,
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `locations-${new Date().toISOString()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
