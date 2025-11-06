import { useEffect, useState } from "react";

interface ProgressCircleProps {
  current: number;
  total: number;
  label: string;
  size?: number;
}

const ProgressCircle = ({ 
  current, 
  total, 
  label, 
  size = 200 
}: ProgressCircleProps) => {
  const [progress, setProgress] = useState(0);
  const percentage = (current / total) * 100;
  const circumference = 2 * Math.PI * 70; // radius = 70
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    // Animate progress on mount
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div 
      className="relative inline-flex items-center justify-center"
      role="img"
      aria-label={`${label}: ${current} of ${total} completed, ${Math.round(percentage)}% progress`}
    >
      <svg 
        width={size} 
        height={size} 
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="70"
          stroke="hsl(var(--border))"
          strokeWidth="12"
          fill="none"
          opacity="0.3"
        />
        
        {/* Progress circle with glow */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r="70"
          stroke="url(#gradient)"
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_hsl(var(--primary))]"
          style={{
            filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))'
          }}
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-foreground">
          {current}
        </span>
        <span className="text-sm text-muted-foreground">
          of {total}
        </span>
        <span className="text-xs text-primary font-semibold mt-1">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ProgressCircle;
