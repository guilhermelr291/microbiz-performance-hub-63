import { DateRange } from '@/types/metrics';

interface DashboardHeaderProps {
  title?: string;
  description?: string;
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange) => void;
}

export const DashboardHeader = ({ title = 'Dashboard', description = 'An overview of recent data of customers info, products details and analysis.', dateRange, onDateRangeChange }: DashboardHeaderProps) => {
  return (
    <div className="w-full bg-background">
      <div className="px-6 py-6">
        {/* Dashboard Title and Description */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};