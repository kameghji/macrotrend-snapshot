
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedNumber from './AnimatedNumber';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  previousValue?: number;
  change?: number;
  formatFn?: (value: number) => string;
  changeFormatFn?: (value: number) => string;
  className?: string;
  isPercent?: boolean;
  inverseTrend?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  previousValue,
  change = 0,
  formatFn = (v) => v.toString(),
  changeFormatFn,
  className,
  isPercent = false,
  inverseTrend = false,
}) => {
  // Format the change value
  const formattedChange = changeFormatFn 
    ? changeFormatFn(change) 
    : (isPercent ? (change > 0 ? '+' : '') + change.toFixed(1) + '%' : (change > 0 ? '+' : '') + change.toFixed(2));

  // Determine if the trend is positive or negative
  // For some metrics like unemployment, a decrease is actually positive
  const isPositive = inverseTrend ? change < 0 : change > 0;
  const isNeutral = change === 0;

  return (
    <div className={cn(
      'glass p-6 rounded-2xl transition-all duration-300 h-full',
      'hover:shadow-lg transform hover:-translate-y-1',
      className
    )}>
      <div className="flex flex-col space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        
        <div className="flex items-baseline space-x-2">
          <span className="text-3xl font-semibold tracking-tight">
            <AnimatedNumber 
              value={value} 
              previousValue={previousValue}
              formatFn={formatFn} 
              className="transition-all duration-300"
            />
          </span>
          
          {change !== undefined && !isNeutral && (
            <span className={cn(
              'inline-flex items-center text-sm font-medium',
              isPositive ? 'text-green-600' : 'text-red-600',
            )}>
              {isPositive ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {formattedChange}
            </span>
          )}
          
          {isNeutral && (
            <span className="inline-flex items-center text-sm font-medium text-gray-500">
              <Minus className="w-3 h-3 mr-1" />
              No change
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
