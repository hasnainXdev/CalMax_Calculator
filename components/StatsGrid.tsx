'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getTodayString } from '@/lib/store';
import { ChevronLeft, ChevronRight, Calendar, Flame, Target } from 'lucide-react';

interface DayLog {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  calorieGoal: number;
  entries: { name: string; calories: number; quantity: number }[];
}

interface StatsGridProps {
  dayLogs: Record<string, DayLog>;
}

export function StatsGrid({ dayLogs }: StatsGridProps) {
  const today = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // Generate last 30 days
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    days.push(dateStr);
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Get selected day log
  const selectedLog = dayLogs[selectedDate];

  // Navigate dates
  const navigateDate = (direction: 'prev' | 'next') => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    
    // Don't go beyond 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    if (currentDate >= thirtyDaysAgo && currentDate <= new Date()) {
      setSelectedDate(currentDate.toISOString().split('T')[0]);
    }
  };

  // Calculate stats for selected date
  const calorieProgress = selectedLog 
    ? (selectedLog.totalCalories / selectedLog.calorieGoal) * 100 
    : 0;
  
  const isOnTarget = selectedLog && selectedLog.totalCalories >= selectedLog.calorieGoal * 0.9 && selectedLog.totalCalories <= selectedLog.calorieGoal * 1.1;
  const isOver = selectedLog && selectedLog.totalCalories > selectedLog.calorieGoal * 1.1;
  const isUnder = selectedLog && selectedLog.totalCalories < selectedLog.calorieGoal * 0.9;

  return (
    <div className="space-y-6">
      {/* 30-Day Activity Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">30-Day Activity</h3>
        <p className="text-sm text-muted-foreground mb-4">Your calorie tracking journey</p>

        <div className="grid grid-cols-7 gap-1.5">
          {dayLabels.map((label, i) => (
            <div key={i} className="text-xs text-center text-muted-foreground py-2 font-medium">
              {label}
            </div>
          ))}

          {days.map((dateStr) => {
            const log = dayLogs[dateStr];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const hasData = !!log;
            const logIsOnTarget = hasData && log.totalCalories >= log.calorieGoal * 0.9 && log.totalCalories <= log.calorieGoal * 1.1;
            const logIsOver = hasData && log.totalCalories > log.calorieGoal * 1.1;
            const logIsUnder = hasData && log.totalCalories < log.calorieGoal * 0.9;

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-xs
                  transition-all relative group
                  ${isToday ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                  ${isSelected ? 'ring-2 ring-primary' : ''}
                  ${!hasData ? 'bg-secondary/30 hover:bg-secondary/50' : ''}
                  ${logIsOnTarget ? 'bg-success/80 hover:bg-success' : ''}
                  ${logIsOver ? 'bg-destructive/80 hover:bg-destructive' : ''}
                  ${logIsUnder && hasData ? 'bg-primary/60 hover:bg-primary' : ''}
                `}
              >
                <span className={`tabular-nums ${hasData ? 'text-white font-medium' : 'text-muted-foreground'}`}>
                  {new Date(dateStr).getDate()}
                </span>

                <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                  <div className="bg-card text-foreground text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg border border-border">
                    <div className="font-medium">{Math.round(log?.totalCalories || 0)} / {log?.calorieGoal || 0} kcal</div>
                    <div className="text-muted-foreground">
                      {new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-4">
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

      {/* Selected Date Details */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric' 
              })}
              {selectedDate === today && <span className="text-xs text-primary">(Today)</span>}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
                disabled={selectedDate <= days[days.length - 1]}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
                disabled={selectedDate >= today}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!selectedLog ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No data logged for this day</p>
              <p className="text-sm">Start tracking to see your progress!</p>
            </div>
          ) : (
            <>
              {/* Calorie Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-muted-foreground">Calories</span>
                  </div>
                  <div className="text-2xl font-bold">{Math.round(selectedLog.totalCalories)}</div>
                  <div className="text-xs text-muted-foreground">of {selectedLog.calorieGoal} goal</div>
                  <div className="mt-2 w-full bg-secondary rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all ${
                        isOnTarget ? 'bg-success' : isOver ? 'bg-destructive' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(calorieProgress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-muted-foreground">Status</span>
                  </div>
                  <div className={`text-lg font-bold ${
                    isOnTarget ? 'text-success' : isOver ? 'text-destructive' : 'text-primary'
                  }`}>
                    {isOnTarget ? '✓ On Target' : isOver ? '↑ Over' : '↓ Under'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isOnTarget ? 'Great job!' : isOver ? 'A bit over your goal' : 'Below your goal'}
                  </div>
                </div>
              </div>

              {/* Macros */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <div className="text-xs text-muted-foreground">Protein</div>
                  <div className="text-lg font-bold text-orange-500">{Math.round(selectedLog.totalProtein)}g</div>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <div className="text-xs text-muted-foreground">Carbs</div>
                  <div className="text-lg font-bold text-blue-500">{Math.round(selectedLog.totalCarbs)}g</div>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <div className="text-xs text-muted-foreground">Fat</div>
                  <div className="text-lg font-bold text-purple-500">{Math.round(selectedLog.totalFat)}g</div>
                </div>
              </div>

              {/* Food Entries */}
              {selectedLog.entries.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-2">Food Logged ({selectedLog.entries.length})</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1.5">
                    {selectedLog.entries.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 rounded bg-secondary/30">
                        <span>{entry.name} × {entry.quantity}</span>
                        <span className="text-muted-foreground">{Math.round(entry.calories * entry.quantity)} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
