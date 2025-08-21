import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { DataAnalysis } from '@/components/DataAnalysis';

import { Period, DateRange } from '@/types/metrics';
import { useDashboardMetrics } from '@/contexts/DashboardMetricsContext'; // 👈 Hook centralizado
import ComparisonCard from './ComparisonCard';
import FunnelChart from './FunnelChart';
import KpiChart from './KpiChart';

interface MarketingPerformanceProps {
  period: Period;
  dateRange?: DateRange;
  companyBranchId: number;
}

const MarketingPerformance = ({
  period,
  dateRange,
}: MarketingPerformanceProps) => {
  const { marketingMetrics: metrics, isLoading, error } = useDashboardMetrics();

  if (isLoading) return <div>Carregando métricas...</div>;
  if (error) return <div>Erro ao carregar métricas de marketing</div>;

  const getPeriodDescription = () => {
    if (period === 'custom' && dateRange) {
      const formatDate = (date: Date) =>
        format(date, 'd MMMM', { locale: ptBR });
      return `Período: ${formatDate(dateRange.startDate)} - ${formatDate(
        dateRange.endDate
      )}`;
    }
    return 'Mês atual vs mês anterior';
  };

  return (
    <>
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ComparisonCard
          title="Investimento em Marketing"
          value={metrics.totalInvestment.selectedPeriod}
          comparison={
            metrics.totalInvestment.selectedPeriod -
            metrics.totalInvestment.previousMonth
          }
          prefix="R$ "
          description={getPeriodDescription()}
        />
        <ComparisonCard
          title="Leads Gerados"
          value={metrics.totalLeads.selectedPeriod}
          comparison={
            metrics.totalLeads.selectedPeriod - metrics.totalLeads.previousMonth
          }
        />
        <ComparisonCard
          title="Vendas"
          value={metrics.totalSales.selectedPeriod}
          comparison={
            metrics.totalSales.selectedPeriod - metrics.totalSales.previousMonth
          }
        />
      </div>

      {/* KPIs secundários */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <ComparisonCard
          title="Custo por Lead (CPL)"
          value={metrics.averageCpl.selectedPeriod}
          comparison={
            metrics.averageCpl.selectedPeriod - metrics.averageCpl.previousMonth
          }
          prefix="R$ "
        />
        <ComparisonCard
          title="Taxa Atendimento → Venda"
          value={metrics.averageMeetingToSaleRate.selectedPeriod}
          comparison={
            metrics.averageMeetingToSaleRate.selectedPeriod -
            metrics.averageMeetingToSaleRate.previousMonth
          }
          suffix="%"
        />
        <ComparisonCard
          title="ROAS"
          value={metrics.averageRoas.selectedPeriod}
          comparison={
            metrics.averageRoas.selectedPeriod -
            metrics.averageRoas.previousMonth
          }
        />
      </div>

      {/* Funil + Gráfico de Investimento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FunnelChart
          title="Funil de Conversão"
          subtitle="Do lead à venda"
          data={[
            {
              name: 'Leads',
              current: metrics.totalLeads.selectedPeriod,
              previous: metrics.totalLeads.previousMonth,
            },
            {
              name: 'Atendimentos',
              current: metrics.totalLeads.selectedPeriod,
              previous: metrics.totalLeads.previousMonth,
            }, // Ajustar se tiver métricas de reuniões
            {
              name: 'Vendas',
              current: metrics.totalSales.selectedPeriod,
              previous: metrics.totalSales.previousMonth,
            },
          ]}
        />
        <KpiChart
          title="Investimento em Marketing"
          subtitle="Comparação semanal"
          data={metrics.totalInvestment.weeklyData.current.map(
            (w: any, i: number) => ({
              name: w.week,
              current: w.value,
              previous:
                metrics.totalInvestment.weeklyData.previous[i]?.value || 0,
            })
          )}
          type="line"
          prefix="R$ "
          goalValue={metrics.totalInvestment.weeklyData.goal.reduce(
            (acc: number, g: any) => acc + g.value,
            0
          )}
        />
      </div>

      {/* Outros KPIs semanais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <KpiChart
          title="Leads Gerados"
          data={metrics.totalLeads.weeklyData.current.map(
            (w: any, i: number) => ({
              name: w.week,
              current: w.value,
              previous: metrics.totalLeads.weeklyData.previous[i]?.value || 0,
            })
          )}
          type="line"
          goalValue={metrics.totalLeads.weeklyData.goal.reduce(
            (acc: number, g: any) => acc + g.value,
            0
          )}
        />
        <KpiChart
          title="Vendas Realizadas"
          data={metrics.totalSales.weeklyData.current.map(
            (w: any, i: number) => ({
              name: w.week,
              current: w.value,
              previous: metrics.totalSales.weeklyData.previous[i]?.value || 0,
            })
          )}
          type="line"
          goalValue={metrics.totalSales.weeklyData.goal.reduce(
            (acc: number, g: any) => acc + g.value,
            0
          )}
        />
      </div>

      {/* ROAS */}
      <div className="grid grid-cols-1 mt-6">
        <KpiChart
          title="ROAS"
          data={metrics.averageRoas.weeklyData.current.map(
            (w: any, i: number) => ({
              name: w.week,
              current: w.value,
              previous: metrics.averageRoas.weeklyData.previous[i]?.value || 0,
            })
          )}
          type="bar"
          value={metrics.averageRoas.selectedPeriod}
          goalValue={metrics.averageRoas.weeklyData.goal.reduce(
            (acc: number, g: any) => acc + g.value,
            0
          )}
        />
      </div>

      {/* Análise */}
      <DataAnalysis
        title="Análise dos Números - Marketing"
        data={{
          type: 'marketing',
          metrics: {
            investment: metrics.totalInvestment.selectedPeriod,
            leadsGenerated: metrics.totalLeads.selectedPeriod,
            sales: metrics.totalSales.selectedPeriod,
            cpl: metrics.averageCpl.selectedPeriod,
            meetingToSaleRate: metrics.averageMeetingToSaleRate.selectedPeriod,
            roas: metrics.averageRoas.selectedPeriod,
          },
        }}
      />
    </>
  );
};

export default MarketingPerformance;
