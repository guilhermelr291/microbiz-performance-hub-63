import * as React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDashboardFilters } from '@/contexts/DashboardFiltersContext';

export function MonthYearPicker() {
  const { selectedPeriod, setSelectedPeriod } = useDashboardFilters();
  const [isOpen, setIsOpen] = React.useState(false);

  const getCurrentMonthYear = () => {
    if (!selectedPeriod) {
      const now = new Date();
      return {
        month: now.getMonth(),
        year: now.getFullYear(),
      };
    }

    const [month, year] = selectedPeriod.split('/');
    return {
      month: parseInt(month) - 1,
      year: parseInt(year),
    };
  };

  const [currentView, setCurrentView] = React.useState(getCurrentMonthYear());

  React.useEffect(() => {
    setCurrentView(getCurrentMonthYear());
  }, [selectedPeriod]);

  const handleMonthSelect = (month: number) => {
    const monthFormatted = String(month + 1).padStart(2, '0');
    const newPeriod = `${monthFormatted}/${currentView.year}`;
    setSelectedPeriod(newPeriod);
    setIsOpen(false);
  };

  const handlePreviousYear = () => {
    setCurrentView(prev => ({ ...prev, year: prev.year - 1 }));
  };

  const handleNextYear = () => {
    setCurrentView(prev => ({ ...prev, year: prev.year + 1 }));
  };

  const resetToCurrentMonth = () => {
    const now = new Date();
    const currentMonth = String(now.getMonth() + 1).padStart(2, '0');
    const currentYear = now.getFullYear();
    const currentPeriod = `${currentMonth}/${currentYear}`;
    setSelectedPeriod(currentPeriod);
    setCurrentView({
      month: now.getMonth(),
      year: currentYear,
    });
    setIsOpen(false);
  };

  const displayText = React.useMemo(() => {
    if (!selectedPeriod) return 'Selecione o período';

    const [month, year] = selectedPeriod.split('/');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  }, [selectedPeriod]);

  const months = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  const isCurrentMonth = (monthIndex: number) => {
    const current = getCurrentMonthYear();
    return monthIndex === current.month && currentView.year === current.year;
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-start pl-3 pr-3 min-w-[200px]"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>{displayText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePreviousYear}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">{currentView.year}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNextYear}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant={isCurrentMonth(index) ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleMonthSelect(index)}
                  className={cn(
                    'h-10 text-sm',
                    isCurrentMonth(index) &&
                      'bg-primary text-primary-foreground'
                  )}
                >
                  {month.slice(0, 3)}
                </Button>
              ))}
            </div>

            <div className="flex justify-center">
              <Button variant="outline" size="sm" onClick={resetToCurrentMonth}>
                Mês atual
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
