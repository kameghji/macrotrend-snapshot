
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { cn } from '@/lib/utils';

interface ChartProps {
  data: any[];
  dataKey: string;
  xAxisKey?: string;
  title?: string;
  color?: string;
  className?: string;
  height?: number;
  unit?: string;
  formatter?: (value: number) => string;
  gradientColor?: string;
  tooltipFormatter?: (value: number) => string;
}

const Chart: React.FC<ChartProps> = ({
  data,
  dataKey,
  xAxisKey = 'date',
  title,
  color = "#3498db",
  className,
  height = 300,
  unit = '',
  formatter,
  gradientColor,
  tooltipFormatter
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Add a small delay to trigger the animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const defaultFormatter = (value: number) => {
    return value.toString() + unit;
  };

  const displayFormatter = formatter || defaultFormatter;
  const displayTooltipFormatter = tooltipFormatter || displayFormatter;

  return (
    <div className={cn('chart-container', className, isVisible ? 'chart-appear' : '')}>
      {title && <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 40 }} // Increased bottom margin for x-axis
        >
          <defs>
            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" vertical={false} />
          <XAxis 
            dataKey={xAxisKey} 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            axisLine={{ stroke: '#e2e8f0' }} 
            tickLine={false}
            padding={{ left: 10, right: 10 }}
            height={40} // Increased height for x-axis
            dy={10} // Add padding between axis and labels
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#94a3b8' }} 
            axisLine={false} 
            tickLine={false}
            tickFormatter={displayFormatter}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              border: 'none',
              fontSize: '12px'
            }}
            formatter={(value) => [displayTooltipFormatter(value as number), dataKey]}
          />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={2}
            fillOpacity={1}
            fill={`url(#gradient-${dataKey})`}
            activeDot={{ r: 6, strokeWidth: 1, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
