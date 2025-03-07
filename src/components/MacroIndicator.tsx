
import React from 'react';
import { cn } from '@/lib/utils';
import Chart from './Chart';
import StatCard from './StatCard';
import { MacroData } from '@/lib/data';

interface MacroIndicatorProps {
  title: string;
  data: MacroData[];
  dataKey: keyof MacroData;
  color?: string;
  className?: string;
  isPercent?: boolean;
  formatter?: (value: number) => string;
  inverseTrend?: boolean;
  isLoading?: boolean;
}

const MacroIndicator: React.FC<MacroIndicatorProps> = ({
  title,
  data,
  dataKey,
  color = "#3498db",
  className,
  isPercent = false,
  formatter,
  inverseTrend = false,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className={cn('flex flex-col space-y-4', className)}>
        <div className="glass animate-pulse rounded-2xl p-5 h-24"></div>
        <div className="glass animate-pulse rounded-2xl overflow-hidden p-4 h-[300px]"></div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  // Data is already ordered from oldest to newest for chart display
  // Get the latest values (from the end of the array)
  const latestValue = data[data.length - 1][dataKey] as number;
  const previousValue = data.length > 1 ? data[data.length - 2][dataKey] as number : undefined;
  const change = previousValue !== undefined ? latestValue - previousValue : undefined;

  // For stock index, we want percentage change
  const percentChange = previousValue !== undefined && dataKey === 'stockIndex'
    ? ((latestValue - previousValue) / previousValue) * 100
    : change;

  const displayChange = dataKey === 'stockIndex' ? percentChange : change;

  const defaultFormatter = (value: number) => {
    if (isPercent) return value.toFixed(1) + '%';
    if (dataKey === 'stockIndex') return value.toLocaleString();
    return value.toString();
  };

  const displayFormatter = formatter || defaultFormatter;

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <StatCard
        title={title}
        value={latestValue}
        previousValue={previousValue}
        change={displayChange}
        formatFn={displayFormatter}
        isPercent={isPercent || dataKey === 'stockIndex'}
        inverseTrend={inverseTrend}
      />
      
      <div className="glass rounded-2xl overflow-hidden p-4">
        <Chart
          data={data}
          dataKey={dataKey as string}
          color={color}
          title={`${title} Trend`}
          unit={isPercent ? '%' : ''}
          formatter={displayFormatter}
        />
      </div>
    </div>
  );
};

export default MacroIndicator;
