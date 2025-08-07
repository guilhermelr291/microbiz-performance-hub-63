import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Download, FileSpreadsheet } from 'lucide-react';
import { DateRange } from '@/types/metrics';

interface DashboardHeaderProps {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange) => void;
}

export const DashboardHeader = ({ dateRange, onDateRangeChange }: DashboardHeaderProps) => {
  return (
    <div className="w-full bg-background">
      <div className="px-6 py-6">
        {/* Dashboard Title and Description */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of recent data of customers info, products details and analysis.
          </p>
        </div>

        {/* Search and Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search here..."
              className="pl-10 bg-background border-border"
            />
            <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              ⌘K
            </kbd>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" className="flex items-center space-x-2">
              <FileSpreadsheet className="h-4 w-4" />
              <span>Export CSV</span>
            </Button>
            
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Download Report</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};