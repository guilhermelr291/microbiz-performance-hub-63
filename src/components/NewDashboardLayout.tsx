import { ReactNode } from 'react';
import { TopNavigation } from './TopNavigation';
import { DashboardHeader } from './DashboardHeader';
import { DateRange } from '@/types/metrics';

interface NewDashboardLayoutProps {
  children: ReactNode;
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: DateRange) => void;
  onTabChange?: (tabId: string) => void;
}

const NewDashboardLayout = ({ 
  children, 
  dateRange, 
  onDateRangeChange,
  onTabChange 
}: NewDashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation onTabChange={onTabChange} />
      <DashboardHeader 
        dateRange={dateRange} 
        onDateRangeChange={onDateRangeChange} 
      />
      <main className="pb-8">
        {children}
      </main>
    </div>
  );
};

export default NewDashboardLayout;