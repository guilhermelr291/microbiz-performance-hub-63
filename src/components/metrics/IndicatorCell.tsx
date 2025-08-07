
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface IndicatorCellProps {
  value: number;
  comparison: number;
  goalValue?: number;
  status: 'success' | 'warning' | 'danger' | 'neutral';
  isPercentage?: boolean;
}

export const IndicatorCell = ({ value, comparison, goalValue, status, isPercentage = false }: IndicatorCellProps) => {
  let bgColor = '';
  let textColor = '';
  
  switch (status) {
    case 'success':
      bgColor = 'bg-[#2ecc71]';
      textColor = 'text-white';
      break;
    case 'warning':
      bgColor = 'bg-[#FEF7CD]';
      textColor = 'text-black';
      break;
    case 'danger':
      bgColor = 'bg-[#ea384c]';
      textColor = 'text-white';
      break;
    default:
      bgColor = 'bg-gray-100 dark:bg-gray-800';
      textColor = 'text-gray-700 dark:text-gray-300';
  }

  // Format value based on whether it's a percentage or not
  const formattedValue = isPercentage 
    ? `${value}%` 
    : value.toLocaleString('pt-BR');
  
  // Format goal text if it exists
  const goalText = goalValue ? ` / Meta: ${isPercentage ? `${goalValue}%` : goalValue.toLocaleString('pt-BR')}` : '';
  
  // For the comparison indicator styling
  const comparisonColor = comparison > 0 ? 'text-green-500' : comparison < 0 ? 'text-red-500' : 'text-gray-500';
  
  return (
    <div className={`flex items-center justify-between px-4 py-2 rounded-md ${bgColor} ${textColor} font-medium`}>
      <div>
        <span className="mr-1">{formattedValue}{goalText}</span>
      </div>
      <span className={`text-xs flex items-center ml-2 ${textColor}`}>
        {comparison > 0 ? (
          <ArrowUp className="h-3 w-3 mr-1" />
        ) : comparison === 0 ? (
          <Minus className="h-3 w-3 mr-1" />
        ) : (
          <ArrowDown className="h-3 w-3 mr-1" />
        )}
        {Math.abs(comparison)}%
      </span>
    </div>
  );
};
