import { axiosInstance } from '../../../../shared/api/axios-instance';
import type { ChartDataPoint } from '../model/types';

export async function getChartData(): Promise<ChartDataPoint[]> {
  try {
    // Calculate date range for last 7 days
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Last 7 days including today

    console.log('[getChartData] Date range:', {
      start: startDate.toISOString(),
      end: endDate.toISOString(),
      startDateOnly: startDate.toISOString().split('T')[0],
      endDateOnly: endDate.toISOString().split('T')[0]
    });

    // Fetch all locations
    const response = await axiosInstance.get('/locations', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: '1000', // Get all locations in the range
      },
    });

  const locations = response.data.items || [];

  console.log('[getChartData] Received locations:', locations.length);
  console.log('[getChartData] First location:', locations[0]);

  // Group by date
  const dateMap = new Map<string, number>();

  // Initialize all 7 days with 0
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    if (dateKey) {
      dateMap.set(dateKey, 0);
    }
  }

  // Count locations per day
  locations.forEach((loc: { timestamp: string }) => {
    const dateKey = new Date(loc.timestamp).toISOString().split('T')[0];
    if (dateKey) {
      dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
    }
  });

  // Convert to array
  const result = Array.from(dateMap.entries()).map(([date, count]) => ({
    date,
    count,
  }));

  console.log('[getChartData] Result:', result);

  return result;
  } catch (error) {
    console.error('[getChartData] Error:', error);
    // Return empty array on error to not break the dashboard
    return [];
  }
}
