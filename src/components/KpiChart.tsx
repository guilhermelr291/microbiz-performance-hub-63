
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { ChartConfig } from './ChartConfig';

interface KpiChartProps {
  title: string;
  subtitle?: string;
  data: {
    name: string;
    current: number;
    previous?: number;
    goal?: number;
    comparison?: number;
  }[];
  type?: 'line' | 'bar';
  comparison?: number;
  prefix?: string;
  suffix?: string;
  height?: number;
  goalValue?: number;
  workingDays?: number;
  value?: number;
}

const KpiChart = ({
  title,
  subtitle,
  data,
  type = 'line',
  comparison,
  prefix = '',
  suffix = '',
  height = 300,
  goalValue,
  workingDays = 4,
  value,
}: KpiChartProps) => {
  const isPositive = comparison && comparison > 0;
  const isNeutral = comparison && comparison === 0;
  
  const [chartColors, setChartColors] = useState({
    current: '#ff7300', // laranja
    previous: '#3b82f6', // azul
    goal: '#8884d8'
  });

  // For ticket average, use constant goal value; for cumulative metrics, use progressive goals
  const dataWithGoals = data.map((item, index) => {
    if (goalValue) {
      // If the item already has a goal in the data, use it
      if ('goal' in item && item.goal !== undefined) {
        return item;
      }
      // For cumulative metrics (like revenue), use progressive goals
      // For average metrics (like ticket average), use constant goal
      const isAverageMetric = title.toLowerCase().includes('médio') || title.toLowerCase().includes('average');
      if (isAverageMetric) {
        return { ...item, goal: goalValue };
      } else {
        const weeklyGoal = (goalValue / workingDays) * (index + 1);
        return { ...item, goal: weeklyGoal };
      }
    }
    return item;
  });
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {subtitle && <CardDescription>{subtitle}</CardDescription>}
        </div>
        <div className="flex items-center gap-2">
          {comparison !== undefined && (
            <div className={`flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
              isPositive 
                ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' 
                : isNeutral 
                  ? 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
            }`}>
              {isPositive ? (
                <ArrowUp className="mr-1 h-3 w-3" />
              ) : isNeutral ? (
                <Minus className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3" />
              )}
              <span>{Math.abs(comparison)}%</span>
            </div>
          )}
          <ChartConfig 
            onColorsChange={setChartColors} 
            defaultColors={chartColors} 
          />
        </div>
      </CardHeader>
      <CardContent className="relative">
        {/* Percentage badges for bar charts */}
        {type === 'bar' && data.some(item => item.comparison !== undefined) && (
          <div className="absolute top-2 left-0 right-0 flex justify-around z-10">
            {data.map((item, index) => {
              if (item.comparison !== undefined) {
                const isPositive = item.comparison > 0;
                const isNeutral = item.comparison === 0;
                return (
                  <div 
                    key={`badge-${index}`} 
                    className={`flex items-center rounded-md px-2 py-1 text-xs font-semibold ${
                      isPositive 
                        ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' 
                        : isNeutral 
                          ? 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                          : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                    }`}
                  >
                    {isPositive ? (
                      <ArrowUp className="mr-1 h-3 w-3" />
                    ) : isNeutral ? (
                      <Minus className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="mr-1 h-3 w-3" />
                    )}
                    <span>{isPositive ? '+' : ''}{item.comparison}%</span>
                  </div>
                );
              }
              return <div key={`empty-${index}`} className="invisible" />;
            })}
          </div>
        )}
        <ResponsiveContainer width="100%" height={height}>
          {type === 'line' ? (
            <LineChart
              data={dataWithGoals}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${prefix}${value}${suffix}`}
                tickMargin={8}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'previous') return [`${prefix}${value}${suffix}`, 'Período Anterior'];
                  if (name === 'current') return [`${prefix}${value}${suffix}`, 'Período Atual'];
                  if (name === 'goal') return [`${prefix}${value}${suffix}`, 'Meta'];
                  return [`${prefix}${value}${suffix}`, name];
                }}
                labelFormatter={(label) => `Semana: ${label}`}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="line"
                wrapperStyle={{ paddingTop: '20px' }}
              />
              {data.some(item => item.previous !== undefined) && (
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke={chartColors.previous} 
                  strokeWidth={4} 
                  dot={{ r: 6, strokeWidth: 2 }}
                  name="Período Anterior" 
                  strokeDasharray="8 4"
                />
              )}
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke={chartColors.current} 
                strokeWidth={4} 
                dot={{ r: 6, strokeWidth: 2 }} 
                name="Período Atual"
              />
              {(goalValue || data.some(item => item.goal !== undefined)) && (
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke={chartColors.goal}
                  strokeWidth={4}
                  dot={{ r: 6, strokeWidth: 2 }}
                  name="Meta"
                  strokeDasharray="12 6"
                />
              )}
            </LineChart>
          ) : (
            <BarChart
              data={data}
              margin={{ top: 40, right: 10, left: 10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" strokeWidth={1} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tickMargin={8}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `${prefix}${value}${suffix}`}
                tickMargin={8}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const dataItem = data.find(item => item.name === label);
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
                        <p className="font-medium text-foreground mb-2">{label}</p>
                        {dataItem?.comparison !== undefined && (
                          <div className={`flex items-center rounded-md px-2 py-1 text-xs font-semibold mb-2 ${
                            dataItem.comparison > 0 
                              ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400' 
                              : dataItem.comparison === 0 
                                ? 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400'
                          }`}>
                            {dataItem.comparison > 0 ? (
                              <ArrowUp className="mr-1 h-3 w-3" />
                            ) : dataItem.comparison === 0 ? (
                              <Minus className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowDown className="mr-1 h-3 w-3" />
                            )}
                            <span>{Math.abs(dataItem.comparison)}%</span>
                          </div>
                        )}
                        {payload.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between mb-1">
                            <div className="flex items-center">
                              <div 
                                className="w-3 h-3 rounded-sm mr-2" 
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="text-sm text-muted-foreground">{entry.name}:</span>
                            </div>
                            <span className="text-sm font-medium text-foreground ml-2">
                              {prefix}{entry.value}{suffix}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                iconType="rect"
                wrapperStyle={{ paddingTop: '20px' }}
              />
              {data.some(item => item.previous !== undefined) && (
                <Bar 
                  dataKey="previous" 
                  fill={chartColors.previous} 
                  name="Período Anterior" 
                  radius={[4, 4, 0, 0]} 
                  stroke={chartColors.previous}
                  strokeWidth={2}
                />
              )}
              <Bar 
                dataKey="current" 
                fill={chartColors.current} 
                name="Período Atual" 
                radius={[4, 4, 0, 0]} 
                stroke={chartColors.current}
                strokeWidth={2}
              />
              {data.some(item => item.goal !== undefined) && (
                <Bar 
                  dataKey="goal" 
                  fill={chartColors.goal} 
                  name="Meta" 
                  radius={[4, 4, 0, 0]} 
                  stroke={chartColors.goal}
                  strokeWidth={2}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default KpiChart;
