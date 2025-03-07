
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatFn?: (value: number) => string;
  className?: string;
  previousValue?: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 500,
  formatFn = (v) => v.toString(),
  className,
  previousValue
}) => {
  const [displayValue, setDisplayValue] = useState(previousValue !== undefined ? previousValue : value);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (previousValue !== undefined && value !== previousValue) {
      // Determine animation direction
      const direction = value > previousValue ? 'count-up' : 'count-down';
      setAnimationClass(direction);

      // Reset animation after it completes
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setAnimationClass('');
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, previousValue, duration]);

  return (
    <span className={cn('inline-block overflow-hidden', className)}>
      <span className={cn('inline-block', animationClass)}>
        {formatFn(displayValue)}
      </span>
    </span>
  );
};

export default AnimatedNumber;
