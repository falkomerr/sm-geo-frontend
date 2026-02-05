export interface Location {
  id: string;
  userId: string;
  fullName: string;
  latitude: number | string; // API returns as string
  longitude: number | string; // API returns as string
  timestamp: string;
  battery_level?: number;
  address?: string | null;
  description?: string | null;
  admin?: string | null;
  admin_id?: string | null;
  created_at?: string;
  updated_at?: string;
  // For compatibility with existing code
  createdAt?: string;
}

export interface LocationsQuery {
  userId?: string;
  fullName?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface LocationsResponse {
  items: Location[];
  total: number;
  page: number;
  pages: number;
}
