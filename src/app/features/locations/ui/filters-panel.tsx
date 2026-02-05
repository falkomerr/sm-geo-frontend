import { useState } from 'react';
import { FileDown, FileJson } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { DatePicker } from '../../../components/ui/date-picker';
import { exportLocationsCsv } from '../api/export-csv';
import { exportLocationsJson as exportLocationsJsonApi } from '../api/export-json';

interface FiltersPanelProps {
  onFilterChange: (filters: FilterValues) => void;
  isLoading?: boolean;
}

export interface FilterValues {
  userId: string;
  fullName: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export function FiltersPanel({ onFilterChange, isLoading }: FiltersPanelProps) {
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleApply = () => {
    onFilterChange({
      userId,
      fullName,
      startDate,
      endDate,
    });
  };

  const handleReset = () => {
    setUserId('');
    setFullName('');
    setStartDate(undefined);
    setEndDate(undefined);
    onFilterChange({
      userId: '',
      fullName: '',
      startDate: undefined,
      endDate: undefined,
    });
  };

  const handleExportCsv = async () => {
    await exportLocationsCsv({
      userId: userId || undefined,
      fullName: fullName || undefined,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  };

  const handleExportJson = async () => {
    await exportLocationsJsonApi({
      userId: userId || undefined,
      fullName: fullName || undefined,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
    });
  };

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Фильтры</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={isLoading}>
            <FileDown className="mr-2 h-4 w-4" />
            Экспорт CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportJson} disabled={isLoading}>
            <FileJson className="mr-2 h-4 w-4" />
            Экспорт JSON
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Input
            label="ID пользователя"
            placeholder="Фильтр по ID пользователя"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Input
            label="Полное имя"
            placeholder="Фильтр по полному имени"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <DatePicker
            label="Дата начала"
            value={startDate ? startDate.toISOString().split('T')[0] : undefined}
            onChange={(value) => setStartDate(value ? new Date(value) : undefined)}
          />
        </div>

        <div className="space-y-2">
          <DatePicker
            label="Дата окончания"
            value={endDate ? endDate.toISOString().split('T')[0] : undefined}
            onChange={(value) => setEndDate(value ? new Date(value) : undefined)}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleApply} disabled={isLoading}>
          Применить фильтры
        </Button>
        <Button variant="outline" onClick={handleReset} disabled={isLoading}>
          Сбросить
        </Button>
      </div>
    </div>
  );
}
