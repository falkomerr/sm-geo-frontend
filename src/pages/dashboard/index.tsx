import { MapPin, Users, Activity, Clock } from 'lucide-react';
import { StatCard } from '../../app/features/dashboard/ui/stat-card';
import { QuickActions } from '../../app/features/dashboard/ui/quick-actions';
import { RecentActivity } from '../../app/features/dashboard/ui/recent-activity';
import { ChartsSection } from '../../app/features/dashboard/ui/charts-section';
import { getDashboardStats } from '../../app/features/dashboard/api/get-dashboard-stats';
import { getRecentActivity } from '../../app/features/dashboard/api/get-recent-activity';
import { getChartData } from '../../app/features/dashboard/api/get-chart-data';
import type { DashboardStats, RecentActivityItem, ChartDataPoint } from '../../app/features/dashboard/model/types';
import { useShortPolling } from '../../shared/hooks/useShortPolling';

export function DashboardPage() {
  const fetchDashboardData = async () => {
    console.log('[DashboardPage] Starting fetch...');
    const [statsData, activitiesData, chartDataResult] = await Promise.all([
      getDashboardStats(),
      getRecentActivity(),
      getChartData(),
    ]);

    console.log('[DashboardPage] Received data:', {
      statsData,
      activitiesData,
      chartDataResult
    });

    return {
      statsData,
      activitiesData,
      chartDataResult
    };
  };

  const { data: dashboardData, error, isLoading } = useShortPolling({
    fetchFn: fetchDashboardData,
    interval: 5000,
    enabled: true,
  });

  const stats = dashboardData?.statsData || null;
  const recentActivities = dashboardData?.activitiesData || [];
  const chartData = dashboardData?.chartDataResult || [];


  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Дашборд</h1>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      )}

      {isLoading && !stats ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Загрузка дашборда...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Всего локаций"
              value={stats?.totalLocations || 0}
              icon={MapPin}
              trend={stats?.locationsTrend ? {
                value: stats.locationsTrend,
                isPositive: stats.locationsTrend > 0,
              } : undefined}
            />
            <StatCard
              title="Всего пользователей"
              value={stats?.totalUsers || 0}
              icon={Users}
            />
            <StatCard
              title="Всего треков"
              value={stats?.totalTracks || 0}
              icon={Activity}
            />
            <StatCard
              title="Активность за 24ч"
              value={stats?.recentActivity || 0}
              icon={Clock}
            />
          </div>

          {/* Charts Section */}
          <ChartsSection data={chartData} />

          {/* Quick Actions and Recent Activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            <QuickActions />
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      )}
    </div>
  );
}
