import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IndicatorCell } from './IndicatorCell';
import { getIndicatorStatus } from '@/utils/metricsAnalysis';
import { Period, MarketingData } from '@/types/metrics';

import { useDashboardMetrics } from '@/contexts/DashboardMetricsContext';

interface MetricsTableProps {
  marketingData: MarketingData;
  period: Period;
}

export const MetricsTable = ({ marketingData, period }: MetricsTableProps) => {
  const { salesMetrics, customersMetrics } = useDashboardMetrics();

  console.log('salesMetrics', JSON.stringify(salesMetrics, null, 2));
  console.log('customersMetrics', JSON.stringify(customersMetrics, null, 2));

  const calculateComparison = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/3">Indicador</TableHead>
            <TableHead className="w-2/3">Valor x Comparativo Meta</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="font-medium">
            <TableCell colSpan={2} className="bg-muted/50">
              Meta de Vendas
            </TableCell>
          </TableRow>

          {salesMetrics && (
            <>
              <TableRow>
                <TableCell>Faturamento Total</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={salesMetrics.totalRevenue.selectedPeriod}
                    comparison={calculateComparison(
                      salesMetrics.totalRevenue.selectedPeriod,
                      salesMetrics.totalRevenue.previousMonth
                    )}
                    goalValue={salesMetrics.totalRevenue.selectedPeriodGoal}
                    status={getIndicatorStatus(
                      salesMetrics.totalRevenue.selectedPeriod,
                      calculateComparison(
                        salesMetrics.totalRevenue.selectedPeriod,
                        salesMetrics.totalRevenue.previousMonth
                      ),
                      salesMetrics.totalRevenue.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Faturamento Produtos</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={salesMetrics.productRevenue.selectedPeriod}
                    comparison={calculateComparison(
                      salesMetrics.productRevenue.selectedPeriod,
                      salesMetrics.productRevenue.previousMonth
                    )}
                    goalValue={salesMetrics.productRevenue.selectedPeriodGoal}
                    status={getIndicatorStatus(
                      salesMetrics.productRevenue.selectedPeriod,
                      calculateComparison(
                        salesMetrics.productRevenue.selectedPeriod,
                        salesMetrics.productRevenue.previousMonth
                      ),
                      salesMetrics.productRevenue.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Faturamento Serviços</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={salesMetrics.serviceRevenue.selectedPeriod}
                    comparison={calculateComparison(
                      salesMetrics.serviceRevenue.selectedPeriod,
                      salesMetrics.serviceRevenue.previousMonth
                    )}
                    goalValue={salesMetrics.serviceRevenue.selectedPeriodGoal}
                    status={getIndicatorStatus(
                      salesMetrics.serviceRevenue.selectedPeriod,
                      calculateComparison(
                        salesMetrics.serviceRevenue.selectedPeriod,
                        salesMetrics.serviceRevenue.previousMonth
                      ),
                      salesMetrics.serviceRevenue.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Ticket Médio</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={salesMetrics.averageTicket.selectedPeriod}
                    comparison={calculateComparison(
                      salesMetrics.averageTicket.selectedPeriod,
                      salesMetrics.averageTicket.previousMonth
                    )}
                    goalValue={salesMetrics.averageTicket.selectedPeriodGoal}
                    status={getIndicatorStatus(
                      salesMetrics.averageTicket.selectedPeriod,
                      calculateComparison(
                        salesMetrics.averageTicket.selectedPeriod,
                        salesMetrics.averageTicket.previousMonth
                      ),
                      salesMetrics.averageTicket.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>
            </>
          )}

          <TableRow className="font-medium">
            <TableCell colSpan={2} className="bg-muted/50">
              Meta de Clientes
            </TableCell>
          </TableRow>

          {customersMetrics && (
            <>
              <TableRow>
                <TableCell>Clientes Atendidos</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={customersMetrics.customersServed.selectedPeriod}
                    comparison={calculateComparison(
                      customersMetrics.customersServed.selectedPeriod,
                      customersMetrics.customersServed.previousMonth
                    )}
                    goalValue={
                      customersMetrics.customersServed.selectedPeriodGoal
                    }
                    status={getIndicatorStatus(
                      customersMetrics.customersServed.selectedPeriod,
                      calculateComparison(
                        customersMetrics.customersServed.selectedPeriod,
                        customersMetrics.customersServed.previousMonth
                      ),
                      customersMetrics.customersServed.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Novos Clientes</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={customersMetrics.newCustomers.selectedPeriod}
                    comparison={calculateComparison(
                      customersMetrics.newCustomers.selectedPeriod,
                      customersMetrics.newCustomers.previousMonth
                    )}
                    goalValue={customersMetrics.newCustomers.selectedPeriodGoal}
                    status={getIndicatorStatus(
                      customersMetrics.newCustomers.selectedPeriod,
                      calculateComparison(
                        customersMetrics.newCustomers.selectedPeriod,
                        customersMetrics.newCustomers.previousMonth
                      ),
                      customersMetrics.newCustomers.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Produtos por Cliente</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={customersMetrics.productsPerCustomer.selectedPeriod}
                    comparison={calculateComparison(
                      customersMetrics.productsPerCustomer.selectedPeriod,
                      customersMetrics.productsPerCustomer.previousMonth
                    )}
                    goalValue={
                      customersMetrics.productsPerCustomer.selectedPeriodGoal
                    }
                    status={getIndicatorStatus(
                      customersMetrics.productsPerCustomer.selectedPeriod,
                      calculateComparison(
                        customersMetrics.productsPerCustomer.selectedPeriod,
                        customersMetrics.productsPerCustomer.previousMonth
                      ),
                      customersMetrics.productsPerCustomer.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Serviços por Cliente</TableCell>
                <TableCell>
                  <IndicatorCell
                    value={customersMetrics.servicesPerCustomer.selectedPeriod}
                    comparison={calculateComparison(
                      customersMetrics.servicesPerCustomer.selectedPeriod,
                      customersMetrics.servicesPerCustomer.previousMonth
                    )}
                    goalValue={
                      customersMetrics.servicesPerCustomer.selectedPeriodGoal
                    }
                    status={getIndicatorStatus(
                      customersMetrics.servicesPerCustomer.selectedPeriod,
                      calculateComparison(
                        customersMetrics.servicesPerCustomer.selectedPeriod,
                        customersMetrics.servicesPerCustomer.previousMonth
                      ),
                      customersMetrics.servicesPerCustomer.selectedPeriodGoal
                    )}
                  />
                </TableCell>
              </TableRow>
            </>
          )}

          <TableRow className="font-medium">
            <TableCell colSpan={2} className="bg-muted/50">
              Meta de Marketing
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Investimento em Marketing</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.investment}
                comparison={marketingData.investmentComparison || 0}
                goalValue={marketingData.goalInvestment}
                status={getIndicatorStatus(
                  marketingData.investment,
                  marketingData.investmentComparison || 0,
                  marketingData.goalInvestment
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Leads Gerados</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.leadsGenerated}
                comparison={marketingData.leadsGeneratedComparison || 0}
                goalValue={marketingData.goalLeadsGenerated}
                status={getIndicatorStatus(
                  marketingData.leadsGenerated,
                  marketingData.leadsGeneratedComparison || 0,
                  marketingData.goalLeadsGenerated
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Atendimentos Realizados</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.leadsMeetings}
                comparison={marketingData.leadsMeetingsComparison || 0}
                goalValue={marketingData.goalLeadsMeetings}
                status={getIndicatorStatus(
                  marketingData.leadsMeetings,
                  marketingData.leadsMeetingsComparison || 0,
                  marketingData.goalLeadsMeetings
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Vendas Realizadas</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.sales}
                comparison={marketingData.salesComparison || 0}
                goalValue={marketingData.goalSales}
                status={getIndicatorStatus(
                  marketingData.sales,
                  marketingData.salesComparison || 0,
                  marketingData.goalSales
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>CPL</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.cpl}
                comparison={marketingData.cplComparison || 0}
                goalValue={marketingData.goalCpl}
                status={getIndicatorStatus(
                  marketingData.cpl,
                  marketingData.cplComparison || 0,
                  marketingData.goalCpl
                )}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Taxa Lead → Atendimento</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.leadToMeetingRate}
                comparison={marketingData.leadToMeetingRateComparison || 0}
                goalValue={marketingData.goalLeadToMeetingRate}
                status={getIndicatorStatus(
                  marketingData.leadToMeetingRate,
                  marketingData.leadToMeetingRateComparison || 0,
                  marketingData.goalLeadToMeetingRate
                )}
                isPercentage={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Taxa Atendimento → Venda</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.meetingToSaleRate}
                comparison={marketingData.meetingToSaleRateComparison || 0}
                goalValue={marketingData.goalMeetingToSaleRate}
                status={getIndicatorStatus(
                  marketingData.meetingToSaleRate,
                  marketingData.meetingToSaleRateComparison || 0,
                  marketingData.goalMeetingToSaleRate
                )}
                isPercentage={true}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>ROAS</TableCell>
            <TableCell>
              <IndicatorCell
                value={marketingData.roas}
                comparison={marketingData.roasComparison || 0}
                goalValue={marketingData.goalRoas}
                status={getIndicatorStatus(
                  marketingData.roas,
                  marketingData.roasComparison || 0,
                  marketingData.goalRoas
                )}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="mt-4 space-y-2 text-sm">
        <h4 className="font-medium">Legenda dos Indicadores:</h4>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#ea384c] flex items-center justify-center text-white font-semibold">
              R
            </div>
            <span>Crítico</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#FEF7CD] flex items-center justify-center text-black font-semibold">
              A
            </div>
            <span>Atenção</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-[#2ecc71] flex items-center justify-center text-white font-semibold">
              V
            </div>
            <span>Crescimento</span>
          </div>
        </div>
      </div>
    </div>
  );
};
