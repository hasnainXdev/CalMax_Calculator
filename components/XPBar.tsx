'use client';

import { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { getXpProgress, getNextLevelXp, getXpForLevel } from '@/lib/store';

interface XPBarProps {
  level: number;
  xp: number;
}

export function XPBar({ level, xp }: XPBarProps) {
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const xpProgress = getXpProgress(level, xp);
    setProgress(xpProgress);
    
    const timer = setTimeout(() => {
      setAnimatedProgress(xpProgress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [level, xp]);

  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getNextLevelXp(level);
  const xpIntoLevel = xp - currentLevelXp;
  const xpNeeded = nextLevelXp - currentLevelXp;

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl font-black text-white font-bebas tracking-wide">
            LEVEL {level}
          </span>
        </div>
        <div className="text-xs font-mono text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          {xpIntoLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
        </div>
      </div>
      
      <div className="relative h-3 overflow-hidden rounded-full bg-secondary">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-400 transition-all duration-700 ease-out"
          style={{ width: `${animatedProgress}%` }}
        />
        <div 
          className="absolute inset-0 opacity-40"
          style={{ 
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
            animation: 'shimmer 2s infinite'
          }}
        />
      </div>
    </div>
  );
}
