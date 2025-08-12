import ComparisonCard from '@/components/ComparisonCard';
import KpiChart from '@/components/KpiChart';
import { DataAnalysis } from '@/components/DataAnalysis';
import { useDashboardMetrics } from '@/contexts/DashboardMetricsContext';
import { useDashboardFilters } from '@/contexts/DashboardFiltersContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CustomerOverview = () => {
  const { customersMetrics, isLoading } = useDashboardMetrics();
  const { selectedPeriod } = useDashboardFilters();

  if (isLoading || !customersMetrics || !customersMetrics.customersServed) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            Carregando métricas de clientes...
          </p>
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

    return format(date, "MMMM 'de' yyyy", { locale: ptBR });
  };

  const generateCustomersServedChartData = () => {
    if (!customersMetrics.customersServed?.weeklyData) return [];

    const { current, previous, goal } =
      customersMetrics.customersServed.weeklyData;

    return current.map((currentWeek, index) => ({
      name: currentWeek.week,
      current: currentWeek.value,
      previous: previous[index]?.value || 0,
      goal: goal[index]?.value || 0,
    }));
  };

  const generateNewCustomersChartData = () => {
    if (!customersMetrics.newCustomers?.weeklyData) return [];

    const { current, previous, goal } =
      customersMetrics.newCustomers.weeklyData;

    return current.map((currentWeek, index) => ({
      name: currentWeek.week,
      current: currentWeek.value,
      previous: previous[index]?.value || 0,
      goal: goal[index]?.value || 0,
    }));
  };

  const getProductsAndServicesPerCustomerData = () => {
    const productsPerCustomer = customersMetrics.productsPerCustomer;
    const servicesPerCustomer = customersMetrics.servicesPerCustomer;

    if (!productsPerCustomer || !servicesPerCustomer) return [];

    return [
      {
        name: 'Produtos por Cliente',
        current: productsPerCustomer.selectedPeriod || 0,
        previous: productsPerCustomer.previousMonth || 0,
        goal: productsPerCustomer.selectedPeriodGoal || 0,
        comparison: calculateComparison(
          productsPerCustomer.selectedPeriod || 0,
          productsPerCustomer.previousMonth || 0
        ),
      },
      {
        name: 'Serviços por Cliente',
        current: servicesPerCustomer.selectedPeriod || 0,
        previous: servicesPerCustomer.previousMonth || 0,
        goal: servicesPerCustomer.selectedPeriodGoal || 0,
        comparison: calculateComparison(
          servicesPerCustomer.selectedPeriod || 0,
          servicesPerCustomer.previousMonth || 0
        ),
      },
    ];
  };

  const customersServedComparison = calculateComparison(
    customersMetrics.customersServed?.selectedPeriod || 0,
    customersMetrics.customersServed?.previousMonth || 0
  );

  const newCustomersComparison = calculateComparison(
    customersMetrics.newCustomers?.selectedPeriod || 0,
    customersMetrics.newCustomers?.previousMonth || 0
  );

  const productsPerCustomerComparison = calculateComparison(
    customersMetrics.productsPerCustomer?.selectedPeriod || 0,
    customersMetrics.productsPerCustomer?.previousMonth || 0
  );

  const servicesPerCustomerComparison = calculateComparison(
    customersMetrics.servicesPerCustomer?.selectedPeriod || 0,
    customersMetrics.servicesPerCustomer?.previousMonth || 0
  );

  const goalPercentage = calculateGoalPercentage(
    customersMetrics.customersServed?.selectedPeriod || 0,
    customersMetrics.customersServed?.selectedPeriodGoal || 0
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComparisonCard
          title="Clientes Atendidos"
          value={customersMetrics.customersServed?.selectedPeriod || 0}
          comparison={customersServedComparison}
          goalPercentage={goalPercentage}
          description={getPeriodDescription()}
        />
        <ComparisonCard
          title="Novos Clientes"
          value={customersMetrics.newCustomers?.selectedPeriod || 0}
          comparison={newCustomersComparison}
        />
        <ComparisonCard
          title="Produtos por Cliente"
          value={customersMetrics.productsPerCustomer?.selectedPeriod || 0}
          comparison={productsPerCustomerComparison}
        />
        <ComparisonCard
          title="Serviços por Cliente"
          value={customersMetrics.servicesPerCustomer?.selectedPeriod || 0}
          comparison={servicesPerCustomerComparison}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <KpiChart
          title="Clientes Atendidos por Período"
          subtitle="Comparação com mesmo período do mês anterior"
          data={generateCustomersServedChartData()}
          type="bar"
          comparison={customersServedComparison}
          goalValue={customersMetrics.customersServed?.selectedPeriodGoal || 0}
          height={375}
        />
        <KpiChart
          title="Produtos e Serviços por Cliente"
          subtitle="Produtos vs Serviços por Cliente no período"
          data={getProductsAndServicesPerCustomerData()}
          type="bar"
          height={375}
        />
      </div>

      <div className="grid grid-cols-1 mt-6">
        <KpiChart
          title="Novos Clientes Semanal"
          subtitle="Evolução de novos clientes ao longo das semanas"
          data={generateNewCustomersChartData()}
          type="line"
          comparison={newCustomersComparison}
          goalValue={customersMetrics.newCustomers?.selectedPeriodGoal || 0}
        />
      </div>

      <DataAnalysis
        title="Análise dos Números - Clientes"
        data={{
          type: 'customers',
          metrics: {
            customersServed:
              customersMetrics.customersServed?.selectedPeriod || 0,
            customersServedComparison: customersServedComparison,
            newCustomers: customersMetrics.newCustomers?.selectedPeriod || 0,
            productsPerCustomer:
              customersMetrics.productsPerCustomer?.selectedPeriod || 0,
            servicesPerCustomer:
              customersMetrics.servicesPerCustomer?.selectedPeriod || 0,
            goalValue:
              customersMetrics.customersServed?.selectedPeriodGoal || 0,
            weeklyData: {
              customersServed:
                customersMetrics.customersServed?.weeklyData || null,
              newCustomers: customersMetrics.newCustomers?.weeklyData || null,
              productsPerCustomer:
                customersMetrics.productsPerCustomer?.weeklyData || null,
              servicesPerCustomer:
                customersMetrics.servicesPerCustomer?.weeklyData || null,
            },
          },
        }}
      />
    </>
  );
};

export default CustomerOverview;
