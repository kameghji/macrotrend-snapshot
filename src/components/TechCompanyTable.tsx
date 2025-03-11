
import React from 'react';
import { TechCompanyData } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp, GhostIcon, Database } from 'lucide-react';

interface TechCompanyTableProps {
  companies: TechCompanyData[];
  isLoading: boolean;
  isMockData: boolean;
}

const TechCompanyTable: React.FC<TechCompanyTableProps> = ({ 
  companies, 
  isLoading,
  isMockData
}) => {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto animate-pulse">
        <div className="glass h-[400px] rounded-2xl"></div>
      </div>
    );
  }

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
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-gray-200/30">
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Revenue</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">YoY Growth</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Earnings Date</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Stock Price</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">YTD Change</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">P/E Ratio</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.ticker} className="border-b border-gray-200/30 hover:bg-gray-50/30">
                <td className="p-4">
                  <div className="flex items-center">
                    <div>
                      <p className={cn(
                        "font-medium",
                        isMockData ? "text-gray-600" : ""
                      )}>{company.name}</p>
                      <p className={cn(
                        "text-xs",
                        isMockData ? "text-gray-500" : "text-muted-foreground"
                      )}>{company.ticker}</p>
                    </div>
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
                  "p-4",
                  isMockData ? "text-gray-600" : ""
                )}>{company.revenue}</td>
                <td className="p-4">
                  <span className={cn(
                    "inline-flex items-center",
                    getColorClass(company.revenueGrowth)
                  )}>
                    {company.revenueGrowth > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {company.revenueGrowth.toFixed(1)}%
                  </span>
                </td>
                <td className={cn(
                  "p-4",
                  isMockData ? "text-gray-600" : ""
                )}>{company.earningsDate}</td>
                <td className={cn(
                  "p-4 font-medium",
                  isMockData ? "text-gray-600" : ""
                )}>${company.currentPrice.toFixed(2)}</td>
                <td className="p-4">
                  <span className={cn(
                    "inline-flex items-center",
                    getColorClass(company.priceChange)
                  )}>
                    {company.priceChange > 0 ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {Math.abs(company.priceChange).toFixed(1)}%
                  </span>
                </td>
                <td className={cn(
                  "p-4",
                  isMockData ? "text-gray-600" : ""
                )}>
                  {company.peRatio > 0 ? company.peRatio.toFixed(1) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TechCompanyTable;
