import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';
import { DateRange } from '@/types/metrics';
import { DateRangePicker } from '@/components/DateRangePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MetricsHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
  filial?: 'all' | number;
  availableFiliais?: { id: number; name: string }[];
  onFilialChange?: (filial: 'all' | number) => void;
}

const MetricsHeader = ({
  dateRange,
  onDateRangeChange,
  filial = 'all',
  availableFiliais,
  onFilialChange,
}: MetricsHeaderProps) => {
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(currentDate);

  const getPeriodText = () => {
    return 'Comparando com mesmo período no mês anterior';
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Performance do Negócio
        </h1>
        <p className="text-muted-foreground">{formattedDate}</p>
        <p className="text-sm text-primary font-medium mt-1">
          {getPeriodText()}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {onFilialChange && (
          <div className="w-40">
            <Select
              value={String(filial ?? 'all')}
              onValueChange={v =>
                onFilialChange(v === 'all' ? 'all' : Number(v))
              }
            >
              <SelectTrigger aria-label="Selecionar filial">
                <SelectValue placeholder="Filial" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as filiais</SelectItem>
                {(availableFiliais ?? []).map(f => (
                  <SelectItem key={f.id} value={String(f.id)}>
                    {f.name || `Filial ${f.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="flex items-center">
          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={onDateRangeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricsHeader;
