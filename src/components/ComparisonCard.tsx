
interface ComparisonCardProps {
  title: string;
  value: number;
  comparison: number;
  prefix?: string;
  suffix?: string;
  description?: string;
  goalPercentage?: number;
}

const ComparisonCard = ({
  title,
  value,
  comparison,
  prefix = '',
  suffix = '',
  description,
  goalPercentage
}: ComparisonCardProps) => {
  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-100 dark:bg-green-900/30';
    if (percentage >= 80) return 'bg-yellow-100 dark:bg-yellow-900/30';
    return 'bg-red-100 dark:bg-red-900/30';
  };

  return (
    <div className={`p-6 rounded-lg ${goalPercentage ? getStatusColor(goalPercentage) : ''}`}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-2xl font-bold">
          {prefix}{value.toLocaleString('pt-BR')}{suffix}
        </p>
        {goalPercentage && (
          <span className="text-sm font-medium">
            {goalPercentage.toFixed(1)}% da meta
          </span>
        )}
      </div>
      {comparison !== undefined && (
        <p className="mt-2 flex items-center text-sm">
          <span className={comparison > 0 ? 'text-green-600' : 'text-red-600'}>
            {comparison > 0 ? '↑' : '↓'} {Math.abs(comparison)}%
          </span>
          {description && (
            <span className="ml-2 text-muted-foreground">{description}</span>
          )}
        </p>
      )}
    </div>
  );
};

export default ComparisonCard;
