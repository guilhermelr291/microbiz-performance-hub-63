import ComparisonCard from '@/components/ComparisonCard';
import KpiChart from '@/components/KpiChart';
import { DataAnalysis } from '@/components/DataAnalysis';
import { useDashboardMetrics } from '@/contexts/DashboardMetricsContext';
import { useDashboardFilters } from '@/contexts/DashboardFiltersContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SalesOverview = () => {
  const { salesMetrics, isLoading } = useDashboardMetrics();
  const { selectedPeriod } = useDashboardFilters();

  // Verificar se os dados existem antes de renderizar
  if (isLoading || !salesMetrics || !salesMetrics.totalRevenue) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando métricas de vendas...</p>
        </div>
      </div>
    );
  }

  const calculateComparison = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const calculateGoalPercentage = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return (current / goal) * 100;
  };

  const getPeriodDescription = () => {
    if (!selectedPeriod) return 'Período selecionado';

    const [year, month] = selectedPeriod.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);

    console.log('date:', date);
    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  const generateChartData = () => {
    const chartData = [];
    const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];

    weeks.forEach((week, index) => {
      const progressRatio = (index + 1) / 4;
      chartData.push({
        name: week,
        current: Math.round(
          (salesMetrics.totalRevenue?.selectedPeriod || 0) * progressRatio
        ),
        previous: Math.round(
          (salesMetrics.totalRevenue?.previousMonth || 0) * progressRatio
        ),
        goal: Math.round(
          (salesMetrics.totalRevenue?.selectedPeriodGoal || 0) * progressRatio
        ),
      });
    });

    return chartData;
  };

  // Generate revenue by type data
  const getRevenueByTypeData = () => {
    return [
      {
        name: 'Produtos',
        current: salesMetrics.productRevenue?.selectedPeriod || 0,
        previous: salesMetrics.productRevenue?.previousMonth || 0,
        goal: salesMetrics.productRevenue?.selectedPeriodGoal || 0,
        comparison: calculateComparison(
          salesMetrics.productRevenue?.selectedPeriod || 0,
          salesMetrics.productRevenue?.previousMonth || 0
        ),
      },
      {
        name: 'Serviços',
        current: salesMetrics.serviceRevenue?.selectedPeriod || 0,
        previous: salesMetrics.serviceRevenue?.previousMonth || 0,
        goal: salesMetrics.serviceRevenue?.selectedPeriodGoal || 0,
        comparison: calculateComparison(
          salesMetrics.serviceRevenue?.selectedPeriod || 0,
          salesMetrics.serviceRevenue?.previousMonth || 0
        ),
      },
    ];
  };

  // Generate ticket chart data
  const getTicketChartData = () => {
    const chartData = [];
    const weeks = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];

    weeks.forEach((week, index) => {
      // Simulate some variation in ticket average throughout the month //TODO:
      const variation = Math.round(Math.random() * 40 - 20); // ±20 variation
      chartData.push({
        name: week,
        current: (salesMetrics.averageTicket?.selectedPeriod || 0) + variation,
        previous: (salesMetrics.averageTicket?.previousMonth || 0) + variation,
        goal: salesMetrics.averageTicket?.selectedPeriodGoal || 0,
      });
    });

    return chartData;
  };

  // Calculate comparisons
  const totalRevenueComparison = calculateComparison(
    salesMetrics.totalRevenue?.selectedPeriod || 0,
    salesMetrics.totalRevenue?.previousMonth || 0
  );

  const productRevenueComparison = calculateComparison(
    salesMetrics.productRevenue?.selectedPeriod || 0,
    salesMetrics.productRevenue?.previousMonth || 0
  );

  const serviceRevenueComparison = calculateComparison(
    salesMetrics.serviceRevenue?.selectedPeriod || 0,
    salesMetrics.serviceRevenue?.previousMonth || 0
  );

  const ticketComparison = calculateComparison(
    salesMetrics.averageTicket?.selectedPeriod || 0,
    salesMetrics.averageTicket?.previousMonth || 0
  );

  const goalPercentage = calculateGoalPercentage(
    salesMetrics.totalRevenue?.selectedPeriod || 0,
    salesMetrics.totalRevenue?.selectedPeriodGoal || 0
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComparisonCard
          title="Faturamento Total"
          value={salesMetrics.totalRevenue?.selectedPeriod || 0}
          comparison={totalRevenueComparison}
          prefix="R$ "
          goalPercentage={goalPercentage}
          description={getPeriodDescription()}
        />
        <ComparisonCard
          title="Faturamento em Produtos"
          value={salesMetrics.productRevenue?.selectedPeriod || 0}
          comparison={productRevenueComparison}
          prefix="R$ "
        />
        <ComparisonCard
          title="Faturamento em Serviços"
          value={salesMetrics.serviceRevenue?.selectedPeriod || 0}
          comparison={serviceRevenueComparison}
          prefix="R$ "
        />
        <ComparisonCard
          title="Ticket Médio"
          value={salesMetrics.averageTicket?.selectedPeriod || 0}
          comparison={ticketComparison}
          prefix="R$ "
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <KpiChart
          title="Faturamento por Período"
          subtitle="Comparação com mesmo período do mês anterior"
          data={generateChartData()}
          type="bar"
          comparison={totalRevenueComparison}
          prefix="R$ "
          goalValue={salesMetrics.totalRevenue?.selectedPeriodGoal || 0}
          height={375}
        />
        <KpiChart
          title="Faturamento por Tipo"
          data={getRevenueByTypeData()}
          type="bar"
          prefix="R$ "
          height={375}
        />
      </div>

      <div className="grid grid-cols-1 mt-6">
        <KpiChart
          title="Ticket Médio"
          data={getTicketChartData()}
          type="line"
          comparison={ticketComparison}
          prefix="R$ "
          goalValue={salesMetrics.averageTicket?.selectedPeriodGoal || 0}
        />
      </div>

      <DataAnalysis
        title="Análise dos Números - Vendas"
        data={{
          type: 'sales',
          metrics: {
            totalRevenue: salesMetrics.totalRevenue?.selectedPeriod || 0,
            revenueComparison: totalRevenueComparison,
            productRevenue: salesMetrics.productRevenue?.selectedPeriod || 0,
            serviceRevenue: salesMetrics.serviceRevenue?.selectedPeriod || 0,
            ticketAverage: salesMetrics.averageTicket?.selectedPeriod || 0,
            goalValue: salesMetrics.totalRevenue?.selectedPeriodGoal || 0,
          },
        }}
      />
    </>
  );
};

export default SalesOverview;
