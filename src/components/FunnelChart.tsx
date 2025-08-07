
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";

interface FunnelStageProps {
  label: string;
  value: number;
  previousValue?: number;
  color: string;
  width: string;
  conversionRate?: number;
  goalRate?: number;
}

const ConversionBadge = ({ rate, previousRate, goalRate }: { rate: number; previousRate: number; goalRate: number }) => {
  let bgColor = "";
  if (rate < previousRate && rate < goalRate) {
    bgColor = "bg-[#ea384c]";
  } else if (rate > previousRate && rate < goalRate) {
    bgColor = "bg-[#FEF7CD] text-black";
  } else {
    bgColor = "bg-[#2ecc71]";
  }
  
  return (
    <div className={`${bgColor} rounded-lg px-3 py-1 text-white font-medium backdrop-blur-sm`}>
      {rate.toFixed(1)}%
    </div>
  );
};

const FunnelStage = ({ label, value, previousValue, color, width, conversionRate, goalRate }: FunnelStageProps) => (
  <div className="flex items-center w-full gap-4">
    <div className="relative w-full">
      <div 
        style={{ 
          width,
          background: `linear-gradient(135deg, ${color} 0%, rgba(255,255,255,0.5) 50%, ${color} 100%)`,
        }} 
        className="h-20 flex items-center justify-center text-white font-medium rounded-lg shadow-lg backdrop-blur-sm"
      >
        <div className="text-center">
          <div>{label}</div>
          <div className="text-lg font-bold">{value}</div>
          {previousValue !== undefined && (
            <div className="text-sm opacity-75">Anterior: {previousValue}</div>
          )}
        </div>
      </div>
    </div>
    {conversionRate !== undefined && goalRate !== undefined && previousValue !== undefined && (
      <div className="min-w-[100px]">
        <ConversionBadge rate={conversionRate} previousRate={previousValue} goalRate={goalRate} />
      </div>
    )}
  </div>
);

interface FunnelChartProps {
  data: Array<{
    name: string;
    current: number;
    previous: number;
    goalRate?: number;
  }>;
  title: string;
  subtitle?: string;
}

const FunnelChart = ({ data, title, subtitle }: FunnelChartProps) => {
  const colors = ['#FFD700', '#4169E1', '#228B22']; // Metallic yellow, blue, and green
  
  const getConversionRate = (currentIndex: number) => {
    if (currentIndex === 0) return undefined;
    const currentValue = data[currentIndex].current;
    const previousStageValue = data[currentIndex - 1].current;
    return (currentValue / previousStageValue) * 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <div className="flex flex-col gap-4">
            {data.map((item, index) => (
              <FunnelStage
                key={item.name}
                label={item.name}
                value={item.current}
                previousValue={item.previous}
                color={colors[index]}
                width={`${100 - index * 15}%`}
                conversionRate={getConversionRate(index)}
                goalRate={item.goalRate}
              />
            ))}
          </div>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default FunnelChart;
