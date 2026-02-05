import { axiosInstance } from '../../../../shared/api/axios-instance';
import type { DashboardStats } from '../model/types';
import type { LocationsResponse } from '../../locations/model/types';

type TracksResponse =
  | { tracks?: unknown[]; total?: number }
  | unknown[];

interface LocationsMetaResponse {
  total: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    console.log('[getDashboardStats] Starting...');

    // Fetch total locations count
    const locationsResponse = await axiosInstance.get<LocationsMetaResponse>('/locations', {
      params: { limit: '1' }
    });
    const totalLocations = locationsResponse.data.total;
    console.log('[getDashboardStats] Total locations:', totalLocations);

    // Fetch total tracks
    const tracksResponse = await axiosInstance.get<TracksResponse>('/track');
    console.log('[getDashboardStats] Tracks response:', tracksResponse.data);

    // Handle both array response and object response with total field
    let totalTracks = 0;
    if (Array.isArray(tracksResponse.data)) {
      totalTracks = tracksResponse.data.length;
    } else if (tracksResponse.data && typeof tracksResponse.data === 'object') {
      totalTracks = (tracksResponse.data as { total?: number }).total || 0;
    }
    console.log('[getDashboardStats] Total tracks:', totalTracks);

    // Fetch all locations to calculate unique users and recent activity
    const allLocationsResponse = await axiosInstance.get<LocationsResponse>('/locations', {
      params: { limit: '10000' } // Get all locations
    });
    const locations = allLocationsResponse.data.items || [];
    console.log('[getDashboardStats] All locations count:', locations.length);

    // Calculate unique users
    const uniqueUsers = new Set(locations.map(loc => loc.userId));
    const totalUsers = uniqueUsers.size;
    console.log('[getDashboardStats] Unique users:', totalUsers);

    // Calculate recent activity (last 24h)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    console.log('[getDashboardStats] 24h ago:', twentyFourHoursAgo.toISOString());

    const recentActivity = locations.filter(loc => {
      const timestamp = new Date(loc.timestamp);
      const isRecent = timestamp >= twentyFourHoursAgo;
      console.log('[getDashboardStats] Location timestamp:', loc.timestamp, 'isRecent:', isRecent);
      return isRecent;
    }).length;
    console.log('[getDashboardStats] Recent activity (24h):', recentActivity);

    const result = {
      totalLocations,
      totalUsers,
      totalTracks,
      recentActivity,
    };

    console.log('[getDashboardStats] Final result:', result);

    return result;
  } catch (error) {
    console.error('[getDashboardStats] Error:', error);
    // Return default values on error
    return {
      totalLocations: 0,
      totalUsers: 0,
      totalTracks: 0,
      recentActivity: 0,
    };
  }
}
