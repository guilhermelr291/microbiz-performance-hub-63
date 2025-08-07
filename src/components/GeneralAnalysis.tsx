
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StrategicAnalysis } from "./metrics/StrategicAnalysis";
import { MetricsTable } from "./metrics/MetricsTable";
import { SalesData, CustomersData, MarketingData, Period } from "@/types/metrics";

interface GeneralAnalysisProps {
  salesData: SalesData;
  customersData: CustomersData;
  marketingData: MarketingData;
  period: Period;
}

export const GeneralAnalysis = ({
  salesData,
  customersData,
  marketingData,
  period
}: GeneralAnalysisProps) => {
  return (
    <div className="space-y-6">
      <StrategicAnalysis 
        sales={salesData}
        customers={customersData}
        marketing={marketingData}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Visão Geral de Indicadores</CardTitle>
        </CardHeader>
        <CardContent>
          <MetricsTable 
            salesData={salesData}
            customersData={customersData}
            marketingData={marketingData}
            period={period}
          />
        </CardContent>
      </Card>
    </div>
  );
};
