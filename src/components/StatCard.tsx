
import React from 'react';
import { cn } from '@/lib/utils';
import AnimatedNumber from './AnimatedNumber';
import { ArrowDown, ArrowUp, Minus, Database, GhostIcon } from 'lucide-react';

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
  isMockData?: boolean;
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
  isMockData = false,
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
      'glass transition-all duration-300',
      'hover:shadow-lg transform hover:-translate-y-1 rounded-2xl',
      isMockData && 'border border-dashed border-amber-300/50 bg-amber-50/10',
      className
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-1">
          <h3 className={cn(
            "text-sm font-medium",
            isMockData ? "text-gray-500" : "text-muted-foreground"
          )}>{title}</h3>
          {isMockData && (
            <span className="inline-flex items-center tooltip" aria-label="Mock data">
              <GhostIcon className="h-3 w-3 text-amber-500 ml-1" />
            </span>
          )}
          {!isMockData && (
            <span className="inline-flex items-center tooltip" aria-label="Real data">
              <Database className="h-3 w-3 text-green-500 ml-1" />
            </span>
          )}
        </div>
        
        <div className="flex items-baseline space-x-2">
          <span className={cn(
            "text-2xl font-semibold tracking-tight", 
            isMockData ? "text-gray-600" : ""
          )}>
            <AnimatedNumber 
              value={value} 
              previousValue={previousValue}
              formatFn={formatFn} 
              className="transition-all duration-300"
            />
          </span>
          
          {change !== undefined && !isNeutral && (
            <span className={cn(
              'inline-flex items-center text-xs font-medium',
              isPositive 
                ? (isMockData ? 'text-green-600/50' : 'text-green-600') 
                : (isMockData ? 'text-red-600/50' : 'text-red-600'),
            )}>
              {isPositive ? (
                <ArrowUp className="w-3 h-3 mr-0.5" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-0.5" />
              )}
              {formattedChange}
            </span>
          )}
          
          {isNeutral && (
            <span className={cn(
              "inline-flex items-center text-xs font-medium",
              isMockData ? "text-gray-400" : "text-gray-500"
            )}>
              <Minus className="w-3 h-3 mr-0.5" />
              No change
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
