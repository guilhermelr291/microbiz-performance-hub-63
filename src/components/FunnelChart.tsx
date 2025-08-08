
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer } from "recharts";

interface FunnelStageProps {
  label: string;
  value: number;
  previousValue?: number;
  colorClass: string;
  width: string;
  conversionRate?: number;
  goalRate?: number;
}

const ConversionBadge = ({ rate, previousRate, goalRate }: { rate: number; previousRate: number; goalRate: number }) => {
  // Use design tokens for consistent theming and contrast
  let cls = "";
  if (rate < previousRate && rate < goalRate) {
    cls = "bg-destructive text-destructive-foreground";
  } else if (rate > previousRate && rate < goalRate) {
    cls = "bg-accent text-accent-foreground";
  } else {
    cls = "bg-primary text-primary-foreground";
  }
  
  return (
    <div className={`${cls} rounded-md px-2.5 py-1 text-xs font-medium shadow-sm`}>
      {rate.toFixed(1)}%
    </div>
  );
};

const FunnelStage = ({ label, value, previousValue, colorClass, width, conversionRate, goalRate }: FunnelStageProps) => (
  <div className="flex items-center w-full gap-4 animate-fade-in">
    <div className="relative w-full">
      <div 
        style={{ width, clipPath: 'polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%)' }}
        className={`h-16 md:h-20 flex items-center justify-center rounded-md shadow-lg ring-1 ring-border overflow-hidden ${colorClass}`}
      >
        <div className="text-center">
          <div className="text-sm md:text-base font-medium">{label}</div>
          <div className="text-lg md:text-xl font-bold">{value}</div>
          {previousValue !== undefined && (
            <div className="text-xs md:text-sm opacity-90">Anterior: {previousValue}</div>
          )}
        </div>
      </div>
    </div>
    {conversionRate !== undefined && goalRate !== undefined && previousValue !== undefined && (
      <div className="min-w-[80px] md:min-w-[100px]">
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
  const colorClasses = [
    "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground",
    "bg-gradient-to-r from-accent/90 to-accent text-accent-foreground",
    "bg-gradient-to-r from-destructive/90 to-destructive text-destructive-foreground",
  ];
  
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
                colorClass={colorClasses[index % colorClasses.length]}
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
