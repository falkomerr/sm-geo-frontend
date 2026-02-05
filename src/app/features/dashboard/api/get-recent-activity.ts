import { axiosInstance } from '../../../../shared/api/axios-instance';
import type { RecentActivityItem } from '../model/types';

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  try {
    console.log('[getRecentActivity] Fetching...');

    const response = await axiosInstance.get('/locations', {
      params: {
        limit: '10',
      },
    });

    const items = response.data.items || [];
    console.log('[getRecentActivity] Received items:', items.length);

    return items;
  } catch (error) {
    console.error('[getRecentActivity] Error:', error);
    return [];
  }
}
