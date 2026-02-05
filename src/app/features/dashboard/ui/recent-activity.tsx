import { format } from 'date-fns';
import { MapPin } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import type { RecentActivityItem } from '../model/types';

interface RecentActivityProps {
  activities: RecentActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const handleViewLocations = (activity: RecentActivityItem) => {
    // Navigate to locations page with filters
    const params = new URLSearchParams({
      userId: activity.userId,
      fullName: activity.fullName,
    });
    window.location.href = `/locations?${params.toString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Недавняя активность</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет недавней активности</p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{activity.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {Number(activity.latitude).toFixed(6)}, {Number(activity.longitude).toFixed(6)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(activity.timestamp), 'PPp')}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleViewLocations(activity)}
                  className="shrink-0"
                >
                  Смотреть
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
