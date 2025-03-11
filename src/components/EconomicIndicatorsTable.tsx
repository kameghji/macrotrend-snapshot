
import React from 'react';
import { MacroData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, GhostIcon, Database } from 'lucide-react';

interface EconomicIndicatorsTableProps {
  data: MacroData[];
  isLoading: boolean;
  isMockData: boolean;
}

const EconomicIndicatorsTable: React.FC<EconomicIndicatorsTableProps> = ({ 
  data, 
  isLoading,
  isMockData
}) => {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto animate-pulse">
        <div className="glass h-[250px] rounded-2xl"></div>
      </div>
    );
  }

  if (!data || data.length < 2) return null;

  // Get the last two months' data for comparison
  const currentMonth = data[data.length - 1];
  const previousMonth = data[data.length - 2];

  const indicators = [
    {
      name: "Inflation Rate",
      current: currentMonth.inflation,
      previous: previousMonth.inflation,
      unit: "%",
      inverse: false
    },
    {
      name: "Unemployment Rate",
      current: currentMonth.unemployment,
      previous: previousMonth.unemployment,
      unit: "%",
      inverse: true
    },
    {
      name: "Federal Interest Rate",
      current: currentMonth.interest,
      previous: previousMonth.interest,
      unit: "%",
      inverse: false
    },
    {
      name: "Consumer Sentiment Index",
      current: currentMonth.consumerSentiment,
      previous: previousMonth.consumerSentiment,
      unit: "",
      inverse: false
    }
  ];

  const calculateChange = (current: number, previous: number) => {
    return current - previous;
  };

  const getColorClass = (value: number, inverse = false) => {
    if (value === 0) return isMockData ? "text-gray-400" : "text-gray-500";
    
    if (inverse) {
      return value < 0 
        ? (isMockData ? "text-green-600/50" : "text-green-600") 
        : (isMockData ? "text-red-600/50" : "text-red-600");
    }
    
    return value > 0 
      ? (isMockData ? "text-green-600/50" : "text-green-600") 
      : (isMockData ? "text-red-600/50" : "text-red-600");
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className={cn(
        "glass rounded-2xl",
        isMockData && "border border-dashed border-amber-300/50 bg-amber-50/10"
      )}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Indicator</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Current Value</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Change</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Previous Month</th>
            </tr>
          </thead>
          <tbody>
            {indicators.map((indicator) => {
              const change = calculateChange(indicator.current, indicator.previous);
              return (
                <tr key={indicator.name} className="border-b border-gray-200/30 hover:bg-gray-50/30">
                  <td className="p-4">
                    <div className="flex items-center">
                      <span className={isMockData ? "text-gray-600 font-medium" : "font-medium"}>{indicator.name}</span>
                      {isMockData ? (
                        <span className="inline-flex items-center tooltip ml-2" aria-label="Mock data">
                          <GhostIcon className="h-3 w-3 text-amber-500" />
                        </span>
                      ) : (
                        <span className="inline-flex items-center tooltip ml-2" aria-label="Real data">
                          <Database className="h-3 w-3 text-green-500" />
                        </span>
                      )}
                    </div>
                  </td>
                  <td className={cn(
                    "p-4 text-right font-medium",
                    isMockData ? "text-gray-600" : ""
                  )}>
                    {indicator.current.toFixed(1)}{indicator.unit}
                  </td>
                  <td className="p-4 text-right">
                    <span className={cn(
                      "inline-flex items-center justify-end",
                      getColorClass(change, indicator.inverse)
                    )}>
                      {change > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                      {Math.abs(change).toFixed(1)}{indicator.unit}
                    </span>
                  </td>
                  <td className={cn(
                    "p-4 text-right",
                    isMockData ? "text-gray-500" : "text-muted-foreground"
                  )}>
                    {indicator.previous.toFixed(1)}{indicator.unit}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EconomicIndicatorsTable;
