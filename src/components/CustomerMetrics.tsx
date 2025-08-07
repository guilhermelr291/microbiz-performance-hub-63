
import { Grid } from '@/components/ui/grid';
import ComparisonCard from '@/components/ComparisonCard';
import KpiChart from '@/components/KpiChart';
import { DataAnalysis } from '@/components/DataAnalysis';
import { Period, DateRange } from '@/types/metrics';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getCustomerData = (period: Period, dateRange?: DateRange) => {
  // Function to generate chart data based on date range
  const generateDateChartData = (startDate: Date, endDate: Date, numPoints: number, baseValue: number, growth: number = 1.1) => {
    const result = [];
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const interval = Math.max(1, Math.floor(daysDiff / numPoints));
    
    let currentDate = new Date(startDate);
    for (let i = 0; i < numPoints && currentDate <= endDate; i++) {
      const progressRatio = (i + 1) / numPoints;
      result.push({
        name: format(currentDate, 'dd/MM', { locale: ptBR }),
        current: Math.round(baseValue * progressRatio),
        previous: Math.round((baseValue / growth) * progressRatio)
      });
      currentDate.setDate(currentDate.getDate() + interval);
    }
    
    return result;
  };
  
  if (period === 'custom' && dateRange) {
    // Calculate days in the selected period for scaling data
    const daysDiff = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysInMonth = 30; // Average month length for simple scaling
    const scaleFactor = daysDiff / daysInMonth;
    
    // Scale monthly data based on the selected period
    const customersServed = Math.round(296 * scaleFactor);
    const newCustomers = Math.round(85 * scaleFactor);
    const goalCustomersServed = Math.round(300 * scaleFactor);
    const goalNewCustomers = Math.round(90 * scaleFactor);
    
    return {
      customersServed,
      customersComparison: 18.4,
      newCustomers,
      newCustomersComparison: 30.8,
      productsPerClient: 1.8,
      productsComparison: 12.5,
      servicesPerClient: 3.2,
      servicesComparison: 6.7,
      customerChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, customersServed),
      newCustomersChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, newCustomers),
      productsChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, 1.8, 1.12),
      servicesChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, 3.2, 1.067),
      goalCustomersServed,
      goalNewCustomers,
      goalProductsPerClient: 2.0,
      goalServicesPerClient: 3.5
    };
  } else {
    // Fallback to monthly data
    return {
      customersServed: 296,
      customersComparison: 18.4,
      newCustomers: 85,
      newCustomersComparison: 30.8,
      productsPerClient: 1.8,
      productsComparison: 12.5,
      servicesPerClient: 3.2,
      servicesComparison: 6.7,
      customerChart: [
        { name: '01/04', current: 68, previous: 60 },
        { name: '08/04', current: 72, previous: 65 },
        { name: '15/04', current: 78, previous: 64 },
        { name: '22/04', current: 78, previous: 61 },
      ],
      newCustomersChart: [
        { name: '01/04', current: 20, previous: 16 },
        { name: '08/04', current: 22, previous: 18 },
        { name: '15/04', current: 23, previous: 17 },
        { name: '22/04', current: 20, previous: 14 },
      ],
      productsChart: [
        { name: '01/04', current: 1.7, previous: 1.5 },
        { name: '08/04', current: 1.8, previous: 1.6 },
        { name: '15/04', current: 1.9, previous: 1.6 },
        { name: '22/04', current: 1.8, previous: 1.7 },
      ],
      servicesChart: [
        { name: '01/04', current: 3.1, previous: 3.0 },
        { name: '08/04', current: 3.3, previous: 3.0 },
        { name: '15/04', current: 3.2, previous: 3.1 },
        { name: '22/04', current: 3.2, previous: 3.0 },
      ],
      goalCustomersServed: 300,
      goalNewCustomers: 90,
      goalProductsPerClient: 2.0,
      goalServicesPerClient: 3.5
    };
  }
};

interface CustomerMetricsProps {
  period: Period;
  dateRange?: DateRange;
}

const CustomerMetrics = ({ period, dateRange }: CustomerMetricsProps) => {
  const data = getCustomerData(period, dateRange);
  
  const getPeriodDescription = () => {
    if (period === 'custom' && dateRange) {
      const formatDate = (date: Date) => format(date, 'd MMMM', { locale: ptBR });
      return `Período: ${formatDate(dateRange.startDate)} - ${formatDate(dateRange.endDate)}`;
    }
    return 'Mês atual vs mês anterior';
  };
  
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComparisonCard
          title="Clientes Atendidos"
          value={data.customersServed}
          comparison={data.customersComparison}
          description={getPeriodDescription()}
        />
        <ComparisonCard
          title="Novos Clientes"
          value={data.newCustomers}
          comparison={data.newCustomersComparison}
        />
        <ComparisonCard
          title="Produtos por Cliente"
          value={data.productsPerClient}
          comparison={data.productsComparison}
        />
        <ComparisonCard
          title="Serviços por Cliente"
          value={data.servicesPerClient}
          comparison={data.servicesComparison}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <KpiChart 
          title="Clientes por Período" 
          subtitle="Comparação com mesmo período do mês anterior"
          data={data.customerChart}
          type="line"
          comparison={data.customersComparison}
          goalValue={data.goalCustomersServed}
        />
        <KpiChart 
          title="Novos Clientes" 
          subtitle="Aquisição de clientes"
          data={data.newCustomersChart}
          type="line"
          comparison={data.newCustomersComparison}
          goalValue={data.goalNewCustomers}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <KpiChart 
          title="Produtos por Cliente" 
          data={data.productsChart}
          type="line"
          comparison={data.productsComparison}
        />
        <KpiChart 
          title="Serviços por Cliente" 
          data={data.servicesChart}
          type="line"
          comparison={data.servicesComparison}
        />
      </div>

      <DataAnalysis 
        title="Análise dos Números - Clientes" 
        data={{
          type: "customers",
          metrics: {
            customersServed: data.customersServed,
            customersComparison: data.customersComparison,
            newCustomers: data.newCustomers,
            newCustomersComparison: data.newCustomersComparison,
            productsPerClient: data.productsPerClient,
            servicesPerClient: data.servicesPerClient
          }
        }}
      />
    </>
  );
};

export default CustomerMetrics;
