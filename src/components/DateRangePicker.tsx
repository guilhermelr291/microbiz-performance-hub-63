
import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "@/types/metrics";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  dateRange: DateRange;
  onDateRangeChange: (dateRange: DateRange) => void;
}

export function DateRangePicker({ dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isStartDateSelected, setIsStartDateSelected] = React.useState(false);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    
    if (!isStartDateSelected) {
      const newDateRange = { 
        startDate: selectedDate, 
        endDate: selectedDate 
      };
      setIsStartDateSelected(true);
      onDateRangeChange(newDateRange);
    } else {
      // If the selected date is before the start date, swap them
      if (selectedDate < dateRange.startDate) {
        const newDateRange = {
          startDate: selectedDate,
          endDate: dateRange.startDate,
        };
        setIsStartDateSelected(false);
        onDateRangeChange(newDateRange);
      } else {
        const newDateRange = {
          startDate: dateRange.startDate,
          endDate: selectedDate,
        };
        setIsStartDateSelected(false);
        onDateRangeChange(newDateRange);
      }
    }
  };

  const resetSelection = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    onDateRangeChange({
      startDate: firstDayOfMonth,
      endDate: now
    });
    setIsStartDateSelected(false);
  };

  const displayText = React.useMemo(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const startFormatted = format(dateRange.startDate, "d 'de' MMMM", { locale: ptBR });
      const endFormatted = format(dateRange.endDate, "d 'de' MMMM", { locale: ptBR });
      
      if (startFormatted === endFormatted) {
        return startFormatted;
      }
      
      return `${startFormatted} - ${endFormatted}`;
    }
    return "Selecione um período";
  }, [dateRange]);

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 justify-start pl-3 pr-3"
          >
            <CalendarIcon className="h-4 w-4" />
            <span>{displayText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-2 flex justify-between">
            <span className="text-sm font-medium">
              {isStartDateSelected ? "Selecione a data final" : "Selecione a data inicial"}
            </span>
            <Button variant="ghost" size="sm" onClick={resetSelection}>
              Mês atual
            </Button>
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            className="p-3 pointer-events-auto"
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
