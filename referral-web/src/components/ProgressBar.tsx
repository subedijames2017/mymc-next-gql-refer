import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  max: number;
  className?: string;
  showLabels?: boolean;
  earnedAmount?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  className,
  showLabels = true,
  earnedAmount,
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className={cn('w-full', className)}>
      {/* Track */}
      <div
        className={cn(
          'relative w-full h-3 rounded-full overflow-hidden',
          // light gray track with subtle inner bevel like the mock
          'bg-gray-200/80 shadow-inner'
        )}
      >
        {/* Fill */}
        <div
          className={cn(
            'relative h-full rounded-full transition-all duration-500 ease-out',
            // green gradient similar to the mock
            'bg-gradient-to-r from-lime-300 via-green-500 to-emerald-700'
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* LEFT GLOW (blurry effect) */}
          <div
            className={cn(
              'pointer-events-none absolute left-0 top-1/2 -translate-y-1/2',
              // a soft radial/linear blend that bleeds outside the bar a bit
              'w-24 h-5 bg-gradient-to-r from-lime-300/70 to-transparent',
              'blur-md opacity-80'
            )}
          />

          {/* Subtle highlight on top for depth */}
          <div
            className={cn(
              'pointer-events-none absolute inset-0',
              'bg-gradient-to-b from-white/20 to-transparent'
            )}
          />

          {/* Rounded end “cap” to emphasize the leading edge */}
          <div
            className={cn(
              'pointer-events-none absolute right-0 top-1/2 -translate-y-1/2',
              'h-3 w-3 rounded-full',
              'bg-emerald-800/70'
            )}
          />
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm font-medium text-emerald-800">
            {current}/{max} Referred
          </div>
          {earnedAmount !== undefined && (
            <div className="text-sm font-extrabold text-emerald-800">
              ${earnedAmount} Earned
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
