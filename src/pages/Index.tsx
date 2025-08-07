
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewDashboardLayout from '@/components/NewDashboardLayout';
import SalesOverview from '@/components/SalesOverview';
import CustomerMetrics from '@/components/CustomerMetrics';
import MarketingPerformance from '@/components/MarketingPerformance';
import MenuGoals from '@/components/MenuGoals';
import { GeneralAnalysis } from '@/components/GeneralAnalysis';
import { DashboardCards } from '@/components/DashboardCards';
import CustomersList from '@/components/CustomersList';
import SalesList from '@/components/SalesList';
import { Period, DateRange } from '@/types/metrics';

// Helper function to get previous month's equivalent date range
const getPreviousMonthDateRange = (dateRange: DateRange): DateRange => {
  const prevStartDate = new Date(dateRange.startDate);
  prevStartDate.setMonth(prevStartDate.getMonth() - 1);
  
  const prevEndDate = new Date(dateRange.endDate);
  prevEndDate.setMonth(prevEndDate.getMonth() - 1);
  
  return {
    startDate: prevStartDate,
    endDate: prevEndDate
  };
};

// Function to get default date range (first day of month to today)
const getDefaultDateRange = (): DateRange => {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return {
    startDate: firstDayOfMonth,
    endDate: now
  };
};

const getGeneralData = (dateRange: DateRange) => {
  // For now, we'll simulate the data based on the date range
  // In a real app, this would fetch data from an API using the date range
  
  // Calculate days in the selected period for scaling data
  const daysDiff = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const daysInMonth = 30; // Average month length for simple scaling
  const scaleFactor = daysDiff / daysInMonth;
  
  return {
    sales: {
      totalRevenue: Math.round(78500 * scaleFactor),
      revenueComparison: 22,
      productRevenue: Math.round(42200 * scaleFactor),
      productComparison: 18,
      serviceRevenue: Math.round(36300 * scaleFactor),
      serviceComparison: 26,
      ticketAverage: 265,
      ticketComparison: 8,
      goalValue: Math.round(85000 * scaleFactor),
    },
    customers: {
      customersServed: Math.round(296 * scaleFactor),
      customersComparison: 18.4,
      newCustomers: Math.round(85 * scaleFactor),
      newCustomersComparison: 30.8,
      productsPerClient: 1.8,
      productsComparison: 12.5,
      servicesPerClient: 3.2,
      servicesComparison: 6.7,
      goalCustomersServed: Math.round(300 * scaleFactor),
      goalNewCustomers: Math.round(90 * scaleFactor),
      goalProductsPerClient: 2.0,
      goalServicesPerClient: 3.5
    },
    marketing: {
      investment: Math.round(4500 * scaleFactor),
      investmentComparison: 7,
      leadsGenerated: Math.round(240 * scaleFactor),
      leadsGeneratedComparison: 25,
      leadsMeetings: Math.round(155 * scaleFactor),
      leadsMeetingsComparison: 18,
      sales: Math.round(95 * scaleFactor),
      salesComparison: 12,
      cpl: 18.75,
      cplComparison: -8.5,
      leadToMeetingRate: 64.6,
      leadToMeetingRateComparison: 6.4,
      meetingToSaleRate: 61.3,
      meetingToSaleRateComparison: 4.8,
      roas: 5.59,
      roasComparison: 10.5,
      goalInvestment: Math.round(5000 * scaleFactor),
      goalLeadsGenerated: Math.round(260 * scaleFactor),
      goalLeadsMeetings: Math.round(170 * scaleFactor),
      goalSales: Math.round(105 * scaleFactor),
      goalCpl: 19.25,
      goalLeadToMeetingRate: 65.4,
      goalMeetingToSaleRate: 61.8,
      goalRoas: 6.0
    }
  };
};

const Index = () => {
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [activeTab, setActiveTab] = useState('overview');
  const period: Period = 'custom';
  const generalData = getGeneralData(dateRange);

  const calculateAdjustedGoal = (monthlyGoal: number, dateRange: DateRange) => {
    const daysDiff = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysInMonth = 30;
    return Math.round((monthlyGoal / daysInMonth) * daysDiff);
  };

  // Adjust goals based on the selected date range
  useEffect(() => {
    const adjustedSalesGoal = calculateAdjustedGoal(85000, dateRange);
    const adjustedCustomersGoal = calculateAdjustedGoal(300, dateRange);
    const adjustedMarketingGoal = calculateAdjustedGoal(5000, dateRange);

    // In a real application, we would update the goals state here
    console.log('Adjusted goals:', {
      sales: adjustedSalesGoal,
      customers: adjustedCustomersGoal,
      marketing: adjustedMarketingGoal
    });
  }, [dateRange]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <NewDashboardLayout 
      dateRange={dateRange} 
      onDateRangeChange={setDateRange}
      onTabChange={handleTabChange}
    >
      <div className="px-6">
        <DashboardCards />
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Vendas</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
            <TabsTrigger value="marketing">Marketing</TabsTrigger>
            <TabsTrigger value="analysis">Análise Geral</TabsTrigger>
            <TabsTrigger value="goals">Metas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <SalesOverview period={period} dateRange={dateRange} />
          </TabsContent>
          
          <TabsContent value="customers" className="space-y-6">
            <CustomerMetrics period={period} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="clientes" className="space-y-6">
            <CustomersList />
          </TabsContent>

          <TabsContent value="vendas" className="space-y-6">
            <SalesList />
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <MarketingPerformance period={period} dateRange={dateRange} />
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <GeneralAnalysis 
              salesData={generalData.sales}
              customersData={generalData.customers}
              marketingData={generalData.marketing}
              period={period}
            />
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <MenuGoals />
          </TabsContent>
        </Tabs>
      </div>
    </NewDashboardLayout>
  );
};

export default Index;
