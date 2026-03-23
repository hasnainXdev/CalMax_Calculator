'use client';

import { useEffect, useState } from 'react';

interface CalorieRingProps {
  current: number;
  goal: number;
}

export function CalorieRing({ current, goal }: CalorieRingProps) {
  const [animatedCurrent, setAnimatedCurrent] = useState(0);
  
  const percentage = Math.min(100, (current / goal) * 100);
  const isOver = current > goal;
  const isOnTarget = percentage >= 90 && percentage <= 100;
  
  const size = 200;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedCurrent(current);
    }, 100);
    return () => clearTimeout(timer);
  }, [current]);

  const ringColor = isOver 
    ? '#ef4444'
    : isOnTarget 
      ? '#22c55e'
      : '#3b82f6';

  const gradientId = isOver ? 'gradientOver' : isOnTarget ? 'gradientSuccess' : 'gradientDefault';

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradientDefault" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="gradientSuccess" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="gradientOver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272a"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-white tabular-nums">
          {Math.round(animatedCurrent).toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground mt-1">/ {goal.toLocaleString()} kcal</span>
        {isOver && (
          <span className="mt-2 text-xs font-medium text-red-400 bg-red-950/50 px-3 py-1 rounded-full">
            Over goal!
          </span>
        )}
        {isOnTarget && (
          <span className="mt-2 text-xs font-medium text-green-400 bg-green-950/50 px-3 py-1 rounded-full">
            🎯 On target!
          </span>
        )}
      </div>
    </div>
  );
}
