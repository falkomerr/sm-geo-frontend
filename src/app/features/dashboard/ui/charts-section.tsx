import { format } from 'date-fns';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '../../../components/ui/card';
import type { ChartDataPoint } from '../model/types';

interface ChartsSectionProps {
  data: ChartDataPoint[];
}

export function ChartsSection({ data }: ChartsSectionProps) {
  // Calculate max value for scaling
  const maxValue = Math.max(...data.map(d => d.count), 1);

  // Generate chart colors
  const getBarColor = (index: number) => {
    const colors = [
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)',
    ];
    return colors[index % colors.length];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Локации (за 7 дней)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">Нет данных</p>
        ) : (
          <div className="space-y-4">
            {/* Bar Chart */}
            <div className="flex items-end justify-between gap-2 h-64 pt-4">
              {data.map((point, index) => {
                const height = (point.count / maxValue) * 100;
                return (
                  <div
                    key={point.date}
                    className="flex flex-col items-center gap-2 flex-1"
                  >
                    <div className="w-full flex flex-col justify-end h-full">
                      <div
                        className="w-full rounded-t-md transition-all hover:opacity-80"
                        style={{
                          height: `${height}%`,
                          backgroundColor: getBarColor(index),
                          minHeight: point.count > 0 ? '4px' : '0',
                        }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground text-center w-full truncate">
                      {format(new Date(point.date), 'MMM d')}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: 'var(--chart-1)' }}
                />
                <span className="text-muted-foreground">Локации</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t text-sm">
              <span className="text-muted-foreground">Всего:</span>
              <span className="font-semibold">{data.reduce((sum, d) => sum + d.count, 0)} локаций</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Среднее:</span>
              <span className="font-semibold">
                {(data.reduce((sum, d) => sum + d.count, 0) / data.length).toFixed(1)} в день
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
