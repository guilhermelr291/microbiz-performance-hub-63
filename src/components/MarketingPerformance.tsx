import { Grid } from '@/components/ui/grid';
import ComparisonCard from '@/components/ComparisonCard';
import KpiChart from '@/components/KpiChart';
import { DataAnalysis } from '@/components/DataAnalysis';
import FunnelChart from '@/components/FunnelChart';
import { Period, DateRange } from '@/types/metrics';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useGoals } from '@/contexts/GoalsContext';

const getMarketingData = (period: Period, dateRange?: DateRange, goals?: any) => {
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
    const daysDiff = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const daysInMonth = 30;
    const scaleFactor = daysDiff / daysInMonth;
    
    const investment = Math.round(4500 * scaleFactor);
    const leadsGenerated = Math.round(240 * scaleFactor);
    const leadsMeetings = Math.round(155 * scaleFactor);
    const sales = Math.round(95 * scaleFactor);
    const goalInvestment = Math.round((goals?.marketing || 5000) * scaleFactor);
    const goalLeadsGenerated = Math.round((goals?.leadsGenerated || 260) * scaleFactor);
    const goalMeetings = Math.round((goals?.leadsMeetings || 170) * scaleFactor);
    const goalSales = Math.round((goals?.marketingSales || 105) * scaleFactor);
    
    return {
      investment,
      investmentComparison: 12.5,
      leadsGenerated,
      leadsComparison: 20,
      leadsMeetings,
      meetingsComparison: 24,
      sales,
      salesComparison: 26.7,
      cpl: 18.75,
      cplComparison: -6.25,
      leadToMeetingRate: 64.6,
      leadToMeetingComparison: 3.2,
      meetingToSaleRate: 61.3,
      meetingToSaleComparison: 2.5,
      roas: 5.59,
      roasComparison: 16.5,
      conversionFunnel: [
        { name: 'Leads', current: leadsGenerated, previous: Math.round(leadsGenerated / 1.2) },
        { name: 'Atendimentos', current: leadsMeetings, previous: Math.round(leadsMeetings / 1.24) },
        { name: 'Vendas', current: sales, previous: Math.round(sales / 1.267) },
      ],
      investmentChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, investment, 1.125),
      leadsChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, leadsGenerated, 1.2),
      meetingsChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, leadsMeetings, 1.24),
      salesChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, sales, 1.267),
      cplChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, 18.75, 0.9375),
      leadMeetingRateChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, 64.6, 1.032),
      meetingSaleRateChart: generateDateChartData(dateRange.startDate, dateRange.endDate, 7, 61.3, 1.025),
      roasChart: [
        { name: 'Período', current: 5.59, previous: 4.79 },
      ],
      goalInvestment,
      goalLeadsGenerated,
      goalMeetings,
      goalSales,
      goalCpl: goals?.cpl || 19.25,
      goalLeadMeetingRate: goals?.leadToMeetingRate || 65.4,
      goalMeetingSaleRate: goals?.meetingToSaleRate || 61.8,
      goalRoas: goals?.roas || 6.0
    };
  } else {
    return {
      investment: 4500,
      investmentComparison: 12.5,
      leadsGenerated: 240,
      leadsComparison: 20,
      leadsMeetings: 155,
      meetingsComparison: 24,
      sales: 95,
      salesComparison: 26.7,
      cpl: 18.75,
      cplComparison: -6.25,
      leadToMeetingRate: 64.6,
      leadToMeetingComparison: 3.2,
      meetingToSaleRate: 61.3,
      meetingToSaleComparison: 2.5,
      roas: 5.59,
      roasComparison: 16.5,
      conversionFunnel: [
        { name: 'Leads', current: 240, previous: 200 },
        { name: 'Atendimentos', current: 155, previous: 125 },
        { name: 'Vendas', current: 95, previous: 75 },
      ],
      investmentChart: [
        { name: '01/04', current: 1100, previous: 1000 },
        { name: '08/04', current: 1200, previous: 1000 },
        { name: '15/04', current: 1150, previous: 1000 },
        { name: '22/04', current: 1050, previous: 1000 },
      ],
      leadsChart: [
        { name: '01/04', current: 55, previous: 45 },
        { name: '08/04', current: 60, previous: 50 },
        { name: '15/04', current: 65, previous: 55 },
        { name: '22/04', current: 60, previous: 50 },
      ],
      meetingsChart: [
        { name: '01/04', current: 35, previous: 28 },
        { name: '08/04', current: 40, previous: 32 },
        { name: '15/04', current: 42, previous: 34 },
        { name: '22/04', current: 38, previous: 31 },
      ],
      salesChart: [
        { name: '01/04', current: 22, previous: 17 },
        { name: '08/04', current: 24, previous: 19 },
        { name: '15/04', current: 26, previous: 21 },
        { name: '22/04', current: 23, previous: 18 },
      ],
      cplChart: [
        { name: '01/04', current: 20, previous: 22.2 },
        { name: '08/04', current: 20, previous: 20 },
        { name: '15/04', current: 17.7, previous: 18.2 },
        { name: '22/04', current: 17.5, previous: 20 },
      ],
      leadMeetingRateChart: [
        { name: '01/04', current: 63.6, previous: 62.2 },
        { name: '08/04', current: 66.7, previous: 64 },
        { name: '15/04', current: 64.6, previous: 61.8 },
        { name: '22/04', current: 63.3, previous: 62 },
      ],
      meetingSaleRateChart: [
        { name: '01/04', current: 62.9, previous: 60.7 },
        { name: '08/04', current: 60, previous: 59.4 },
        { name: '15/04', current: 61.9, previous: 61.8 },
        { name: '22/04', current: 60.5, previous: 58.1 },
      ],
      roasChart: [
        { name: 'Mês', current: 5.59, previous: 4.79 },
      ],
      goalInvestment: goals?.marketing || 5000,
      goalLeadsGenerated: goals?.leadsGenerated || 260,
      goalMeetings: goals?.leadsMeetings || 170,
      goalSales: goals?.marketingSales || 105,
      goalCpl: goals?.cpl || 19.25,
      goalLeadMeetingRate: goals?.leadToMeetingRate || 65.4,
      goalMeetingSaleRate: goals?.meetingToSaleRate || 61.8,
      goalRoas: goals?.roas || 6.0
    };
  }
};

interface MarketingPerformanceProps {
  period: Period;
  dateRange?: DateRange;
}

const MarketingPerformance = ({ period, dateRange }: MarketingPerformanceProps) => {
  const { goals } = useGoals();
  const data = getMarketingData(period, dateRange, goals);
  
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
          title="Investimento em Marketing"
          value={data.investment}
          comparison={data.investmentComparison}
          prefix="R$ "
          description={getPeriodDescription()}
        />
        <ComparisonCard
          title="Leads Gerados"
          value={data.leadsGenerated}
          comparison={data.leadsComparison}
        />
        <ComparisonCard
          title="Atendimentos"
          value={data.leadsMeetings}
          comparison={data.meetingsComparison}
        />
        <ComparisonCard
          title="Vendas"
          value={data.sales}
          comparison={data.salesComparison}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <ComparisonCard
          title="Custo por Lead (CPL)"
          value={data.cpl}
          comparison={data.cplComparison * -1}
          prefix="R$ "
        />
        <ComparisonCard
          title="Taxa Lead → Atendimento"
          value={data.leadToMeetingRate}
          comparison={data.leadToMeetingComparison}
          suffix="%"
        />
        <ComparisonCard
          title="Taxa Atendimento → Venda"
          value={data.meetingToSaleRate}
          comparison={data.meetingToSaleComparison}
          suffix="%"
        />
        <ComparisonCard
          title="ROAS"
          value={data.roas}
          comparison={data.roasComparison}
          prefix=""
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <FunnelChart 
          title="Funil de Conversão" 
          subtitle="Do lead à venda"
          data={data.conversionFunnel}
        />
        <KpiChart 
          title="Investimento em Marketing" 
          subtitle="Comparação com mesmo período do mês anterior"
          data={data.investmentChart}
          type="line"
          prefix="R$ "
          goalValue={data.goalInvestment}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <KpiChart 
          title="Leads Gerados" 
          data={data.leadsChart}
          type="line"
          comparison={data.leadsComparison}
          goalValue={data.goalLeadsGenerated}
        />
        <KpiChart 
          title="Atendimentos Realizados" 
          data={data.meetingsChart}
          type="line"
          comparison={data.meetingsComparison}
          goalValue={data.goalMeetings}
        />
        <KpiChart 
          title="Vendas Realizadas" 
          data={data.salesChart}
          type="line"
          comparison={data.salesComparison}
          goalValue={data.goalSales}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <KpiChart 
          title="CPL" 
          data={data.cplChart}
          type="line"
          comparison={data.cplComparison * -1}
          prefix="R$ "
        />
        <KpiChart 
          title="Taxa Lead → Atendimento" 
          data={data.leadMeetingRateChart}
          type="line"
          comparison={data.leadToMeetingComparison}
          suffix="%"
        />
        <KpiChart 
          title="Taxa Atendimento → Venda" 
          data={data.meetingSaleRateChart}
          type="line"
          comparison={data.meetingToSaleComparison}
          suffix="%"
        />
      </div>
      
      <div className="grid grid-cols-1 mt-6">
        <KpiChart 
          title="ROAS" 
          data={data.roasChart}
          type="bar"
          comparison={data.roasComparison}
          value={data.roas}
        />
      </div>

      <DataAnalysis 
        title="Análise dos Números - Marketing" 
        data={{
          type: "marketing",
          metrics: {
            investment: data.investment,
            leadsGenerated: data.leadsGenerated,
            leadsMeetings: data.leadsMeetings,
            sales: data.sales,
            cpl: data.cpl,
            leadToMeetingRate: data.leadToMeetingRate,
            meetingToSaleRate: data.meetingToSaleRate,
            roas: data.roas
          }
        }}
      />
    </>
  );
};

export default MarketingPerformance;
