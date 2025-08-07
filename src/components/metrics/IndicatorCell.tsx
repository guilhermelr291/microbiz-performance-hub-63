
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
      bgColor = 'bg-success';
      textColor = 'text-success-foreground';
      break;
    case 'warning':
      bgColor = 'bg-warning';
      textColor = 'text-warning-foreground';
      break;
    case 'danger':
      bgColor = 'bg-danger';
      textColor = 'text-danger-foreground';
      break;
    default:
      bgColor = 'bg-muted';
      textColor = 'text-muted-foreground';
  }

  // Format value based on whether it's a percentage or not
  const formattedValue = isPercentage 
    ? `${value}%` 
    : value.toLocaleString('pt-BR');
  
  // Format goal text if it exists
  const goalText = goalValue ? ` / Meta: ${isPercentage ? `${goalValue}%` : goalValue.toLocaleString('pt-BR')}` : '';
  
  // For the comparison indicator styling
  const comparisonColor = comparison > 0 ? 'text-success' : comparison < 0 ? 'text-danger' : 'text-muted-foreground';
  
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
