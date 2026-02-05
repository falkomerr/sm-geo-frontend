export interface DashboardStats {
  totalLocations: number;
  totalUsers: number;
  totalTracks: number;
  recentActivity: number;
  locationsTrend?: number; // percentage change
}

export interface RecentActivityItem {
  id: string;
  userId: string;
  fullName: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface ChartDataPoint {
  date: string;
  count: number;
}

export interface UserDistribution {
  userId: string;
  fullName: string;
  count: number;
}
