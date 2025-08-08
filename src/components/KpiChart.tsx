
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
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
    current: '#8884d8',
    previous: '#82ca9d',
    goal: '#ff7300'
  });

  // Update to handle weekly goals instead of daily
  const dataWithWeeklyGoals = data.map((item, index) => {
    if (goalValue) {
      const weeklyGoal = (goalValue / workingDays) * (index + 1);
      return { ...item, goal: weeklyGoal };
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
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          {type === 'line' ? (
            <LineChart
              data={dataWithWeeklyGoals}
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
                formatter={(value) => [`${prefix}${value}${suffix}`, 'Valor']}
                labelFormatter={(label) => `Semana: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="current" 
                stroke={chartColors.current} 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                name="Atual"
              />
              {data.some(item => item.previous !== undefined) && (
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke={chartColors.previous} 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  name="Anterior" 
                  strokeDasharray="3 3"
                />
              )}
              {(goalValue || data.some(item => item.goal !== undefined)) && (
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke={chartColors.goal}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Meta"
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          ) : (
            <BarChart
              data={data}
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
                formatter={(value) => [`${prefix}${value}${suffix}`, 'Valor']}
                labelFormatter={(label) => `Semana: ${label}`}
              />
              <Bar dataKey="current" fill={chartColors.current} name="Atual" radius={[4, 4, 0, 0]} />
              {data.some(item => item.previous !== undefined) && (
                <Bar dataKey="previous" fill={chartColors.previous} name="Anterior" radius={[4, 4, 0, 0]} />
              )}
              {data.some(item => item.goal !== undefined) && (
                <Bar dataKey="goal" fill={chartColors.goal} name="Meta" radius={[4, 4, 0, 0]} />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default KpiChart;
