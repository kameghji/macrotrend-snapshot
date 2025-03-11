
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
  isMockData?: boolean;
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
  isMockData = false,
}) => {
  if (isLoading) {
    return (
      <div className={cn('flex flex-col space-y-4', className)}>
        <div className="glass animate-pulse rounded-2xl p-4 h-20"></div>
        <div className="glass animate-pulse rounded-2xl overflow-hidden p-4 h-[340px]"></div>
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  // Data is already ordered from oldest to newest for chart display
  // Get the latest values (from the end of the array)
  const latestValue = data[data.length - 1][dataKey] as number;
  const previousValue = data.length > 1 ? data[data.length - 2][dataKey] as number : undefined;
  const change = previousValue !== undefined ? latestValue - previousValue : undefined;

  // For consumer sentiment, we want percentage change
  const percentChange = previousValue !== undefined && dataKey === 'consumerSentiment'
    ? ((latestValue - previousValue) / previousValue) * 100
    : change;

  const displayChange = dataKey === 'consumerSentiment' ? percentChange : change;

  const defaultFormatter = (value: number) => {
    if (isPercent) return value.toFixed(1) + '%';
    if (dataKey === 'consumerSentiment') return value.toLocaleString();
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
        isPercent={isPercent || dataKey === 'consumerSentiment'}
        inverseTrend={inverseTrend}
        className="py-3 px-4 h-auto" // Smaller card
        isMockData={isMockData}
      />
      
      <div className={cn(
        "glass rounded-2xl overflow-hidden p-4 pb-10 h-[340px]", // Increased height and bottom padding
        isMockData && "border border-dashed border-amber-300/50 bg-amber-50/10"
      )}>
        <Chart
          data={data}
          dataKey={dataKey as string}
          color={color}
          title={`${title} Trend`}
          unit={isPercent ? '%' : ''}
          formatter={displayFormatter}
          height={290} // Increased chart height
        />
      </div>
    </div>
  );
};

export default MacroIndicator;
