import React from 'react';

interface FunnelData {
  name: string;
  current: number;
  previous: number;
  prefix?: string;
  suffix?: string;
  color?: string;
}

interface FunnelChartProps {
  title: string;
  subtitle: string;
  data: FunnelData[];
}

const FunnelChart = ({ title, subtitle, data }: FunnelChartProps) => {
  const formatValue = (value: number, prefix?: string, suffix?: string) => {
    const formattedValue = value.toLocaleString('pt-BR');
    return `${prefix || ''}${formattedValue}${suffix || ''}`;
  };

  const getPercentageWidth = (
    value: number,
    maxValue: number,
    index: number
  ) => {
    const baseWidth = Math.min((value / maxValue) * 100, 100);
    const funnelReduction = index * 8;
    return Math.max(baseWidth - funnelReduction, 20);
  };

  const getComparisonColor = (current: number, previous: number) => {
    if (current > previous) return 'text-green-600';
    if (current < previous) return 'text-red-600';
    return 'text-gray-600';
  };

  const getComparisonIcon = (current: number, previous: number) => {
    if (current > previous) return '↗';
    if (current < previous) return '↘';
    return '→';
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const maxValueForThisMetric = Math.max(item.current, item.previous);

          const currentWidth = getPercentageWidth(
            item.current,
            maxValueForThisMetric,
            index
          );
          const previousWidth = getPercentageWidth(
            item.previous,
            maxValueForThisMetric,
            index
          );

          return (
            <div key={item.name} className="relative">
              {/* Label */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.name}
                </span>
                <div className="flex items-center space-x-3 text-sm">
                  <span className="font-semibold text-gray-900">
                    {formatValue(item.current, item.prefix, item.suffix)}
                  </span>
                  <span
                    className={`flex items-center space-x-1 ${getComparisonColor(
                      item.current,
                      item.previous
                    )}`}
                  >
                    <span>
                      {getComparisonIcon(item.current, item.previous)}
                    </span>
                    <span>
                      {formatValue(item.previous, item.prefix, item.suffix)}
                    </span>
                  </span>
                </div>
              </div>

              <div className="relative mb-3">
                <div className="relative h-12 mb-1">
                  <div
                    className="h-full rounded-lg relative overflow-hidden"
                    style={{
                      width: `${currentWidth}%`,
                      backgroundColor: item.color || '#3B82F6',
                      margin: `0 ${(100 - currentWidth) / 2}%`,
                      clipPath:
                        index === 0
                          ? 'none'
                          : `polygon(${8}% 0%, ${92}% 0%, ${88}% 100%, ${12}% 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        Atual
                      </span>
                    </div>
                  </div>
                </div>

                <div className="relative h-8">
                  <div
                    className="h-full rounded-md"
                    style={{
                      width: `${previousWidth}%`,
                      backgroundColor: (item.color || '#3B82F6') + '40',
                      margin: `0 ${(100 - previousWidth) / 2}%`,
                      clipPath:
                        index === 0
                          ? 'none'
                          : `polygon(${8}% 0%, ${92}% 0%, ${88}% 100%, ${12}% 100%)`,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="text-xs font-medium"
                        style={{ color: item.color || '#3B82F6' }}
                      >
                        Anterior
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {index < data.length - 1 && (
                <div className="flex justify-center">
                  <div className="w-px h-4 bg-gray-300"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-500"></div>
            <span>Período Atual</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-blue-200"></div>
            <span>Período Anterior</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
