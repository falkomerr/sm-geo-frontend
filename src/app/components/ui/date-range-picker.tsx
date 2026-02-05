'use client';
import { format } from 'date-fns';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@app/lib/utils';
import { Button } from '@app/components/ui/button';
import { Calendar } from '@app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/ui/popover';
import { ru } from 'date-fns/locale';

export function DateRangePicker({
  label,
  value,
  inline,
  onChange,
  error,
  disabled,
}: {
  label?: string;
  value?: { from?: string; to?: string };
  inline?: boolean;
  onChange?: (value: { from?: string; to?: string }) => void;
  error?: string;
  disabled?: boolean;
}) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    value?.from && value?.to ? { from: new Date(value.from), to: new Date(value.to) } : undefined,
  );

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range && onChange) {
      onChange({
        from: range.from ? formatDateToString(range.from) : undefined,
        to: range.to ? formatDateToString(range.to) : undefined,
      });
    } else if (!range && onChange) {
      onChange({});
    }
  };

  React.useEffect(() => {
    if (value?.from && value?.to) {
      setDateRange({ from: new Date(value.from), to: new Date(value.to) });
    } else {
      setDateRange(undefined);
    }
  }, [value]);

  const formatDateRange = (): string => {
    if (!dateRange?.from) return '';
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'PPP', { locale: ru })} - ${format(dateRange.to, 'PPP', { locale: ru })}`;
    }
    return format(dateRange.from, 'PPP', { locale: ru });
  };

  return (
    <div className="z-[999] flex w-full flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="secondary"
            data-empty={!dateRange}
            className={cn(
              'relative flex h-[88px] w-full flex-col items-start rounded-[16px] border px-4 py-5 disabled:cursor-not-allowed disabled:opacity-50',
              error ? 'border-red-500 bg-red-50' : 'border-black/20 bg-white',
              inline && 'flex h-8 items-center justify-center rounded-full px-[15px] py-[12px]',
            )}
          >
            {label && (
              <span className={cn('text-xs font-medium', error ? 'text-red-600' : 'text-black/40')}>
                {label}
              </span>
            )}
            {dateRange?.from ? (
              <div className="flex w-full items-center gap-x-1">
                <CalendarIcon className="size-4 text-lg text-black" />
                <span className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                  {formatDateRange()}
                </span>
                <ChevronDown className="ml-auto size-3 text-base text-black" />
              </div>
            ) : (
              <div className="flex w-full items-center gap-x-1">
                <CalendarIcon className="size-4 text-lg text-black" />
                <span className="text-muted-foreground text-sm font-medium">Дата/Месяц/Год</span>
                <ChevronDown className="ml-auto size-3 text-base text-black" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" align="end" className="relative z-[999] w-auto p-0">
          <Calendar mode="range" selected={dateRange} onSelect={handleDateSelect} />
        </PopoverContent>
      </Popover>
      {error && <span className="mt-1 text-sm text-red-600">{error}</span>}
    </div>
  );
}
