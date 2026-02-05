'use client';
import { format } from 'date-fns';
import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@app/lib/utils';
import { Button } from '@app/components/ui/button';
import { Calendar } from '@app/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@app/components/ui/popover';
import { ru } from 'date-fns/locale';

export function DatePicker({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}) {
  const [date, setDate] = React.useState<Date | undefined>(value ? new Date(value) : undefined);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate && onChange) {
      onChange(formatDateToString(selectedDate));
    } else if (!selectedDate && onChange) {
      onChange('');
    }
  };

  React.useEffect(() => {
    if (value) {
      setDate(new Date(value));
    } else {
      setDate(undefined);
    }
  }, [value]);

  return (
    <div className="z-[999] flex w-full flex-col">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="secondary"
            data-empty={!date}
            className={cn(
              'relative flex h-12 w-full items-center rounded-[16px] border px-4 py-0',
              error ? 'border-red-500 bg-red-50' : 'border-black/20 bg-white'
            )}
          >
            {date ? (
              <div className="flex w-full items-center gap-x-1">
                <CalendarIcon className="size-4 text-lg text-black" />
                <span className="text-sm font-medium">{format(date, 'PPP', { locale: ru })}</span>
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
        <PopoverContent
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'center' : 'end'}
          className="relative z-[999] w-auto p-0"
        >
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </PopoverContent>
      </Popover>
      {error && <span className="mt-1 text-sm text-red-600">{error}</span>}
    </div>
  );
}
