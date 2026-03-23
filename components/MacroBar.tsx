'use client';

import { useEffect, useState } from 'react';

interface MacroBarProps {
  protein: number;
  carbs: number;
  fat: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
}

export function MacroBar({ 
  protein, 
  carbs, 
  fat,
  proteinGoal = 150,
  carbsGoal = 300,
  fatGoal = 80 
}: MacroBarProps) {
  const [animatedProtein, setAnimatedProtein] = useState(0);
  const [animatedCarbs, setAnimatedCarbs] = useState(0);
  const [animatedFat, setAnimatedFat] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProtein(protein);
      setAnimatedCarbs(carbs);
      setAnimatedFat(fat);
    }, 200);
    return () => clearTimeout(timer);
  }, [protein, carbs, fat]);

  const proteinPercent = Math.min(100, (protein / proteinGoal) * 100);
  const carbsPercent = Math.min(100, (carbs / carbsGoal) * 100);
  const fatPercent = Math.min(100, (fat / fatGoal) * 100);

  return (
    <div className="space-y-5">
      {/* Protein */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-blue-400">Protein</span>
          <span className="font-mono text-muted-foreground tabular-nums">
            {Math.round(animatedProtein)}g / {proteinGoal}g
          </span>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700 ease-out"
            style={{ width: `${proteinPercent}%` }}
          />
        </div>
      </div>

      {/* Carbs */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-amber-400">Carbs</span>
          <span className="font-mono text-muted-foreground tabular-nums">
            {Math.round(animatedCarbs)}g / {carbsGoal}g
          </span>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-700 ease-out"
            style={{ width: `${carbsPercent}%` }}
          />
        </div>
      </div>

      {/* Fat */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="font-medium text-purple-400">Fat</span>
          <span className="font-mono text-muted-foreground tabular-nums">
            {Math.round(animatedFat)}g / {fatGoal}g
          </span>
        </div>
        <div className="relative h-2.5 overflow-hidden rounded-full bg-secondary">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-700 ease-out"
            style={{ width: `${fatPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
