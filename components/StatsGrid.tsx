'use client';

import { Card, CardContent } from '@/components/ui/card';
import { getTodayString } from '@/lib/store';

interface StatsGridProps {
  dayLogs: Record<string, { totalCalories: number; calorieGoal: number }>;
}

export function StatsGrid({ dayLogs }: StatsGridProps) {
  const today = getTodayString();
  
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push(dateStr);
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">30-Day Activity</h3>
        <p className="text-sm text-muted-foreground">Your calorie tracking journey</p>
      </div>
      
      <div className="grid grid-cols-7 gap-1.5">
        {dayLabels.map((label, i) => (
          <div key={i} className="text-xs text-center text-muted-foreground py-2 font-medium">
            {label}
          </div>
        ))}
        
        {days.map((dateStr) => {
          const log = dayLogs[dateStr];
          const isToday = dateStr === today;
          const hasData = !!log;
          const isOnTarget = hasData && log.totalCalories >= log.calorieGoal * 0.9 && log.totalCalories <= log.calorieGoal * 1.1;
          const isOver = hasData && log.totalCalories > log.calorieGoal * 1.1;
          const isUnder = hasData && log.totalCalories < log.calorieGoal * 0.9;
          
          return (
            <div
              key={dateStr}
              className={`
                aspect-square rounded-lg flex items-center justify-center text-xs
                transition-all relative group
                ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                ${!hasData ? 'bg-secondary/30' : ''}
                ${isOnTarget ? 'bg-success/80 hover:bg-success' : ''}
                ${isOver ? 'bg-destructive/80 hover:bg-destructive' : ''}
                ${isUnder && hasData ? 'bg-primary/60 hover:bg-primary' : ''}
              `}
            >
              <span className={`tabular-nums ${hasData ? 'text-white font-medium' : 'text-muted-foreground'}`}>
                {new Date(dateStr).getDate()}
              </span>
              
              <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                <div className="bg-card text-foreground text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg border border-border">
                  <div className="font-medium">{Math.round(log?.totalCalories || 0)} / {log?.calorieGoal || 0} kcal</div>
                  <div className="text-muted-foreground">
                    {new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-success/80" />
          <span>On Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-primary/60" />
          <span>Under</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-destructive/80" />
          <span>Over</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-secondary/30" />
          <span>Rest Day</span>
        </div>
      </div>
    </div>
  );
}
