'use client';

import { useGameStore } from '@/hooks/useGameStore';
import { XPBar } from '@/components/XPBar';
import { CalorieRing } from '@/components/CalorieRing';
import { MacroBar } from '@/components/MacroBar';
import { FoodForm } from '@/components/FoodForm';
import { ChallengesPanel } from '@/components/ChallengesPanel';
import { StatsGrid } from '@/components/StatsGrid';
import { NotifToast } from '@/components/NotifToast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Flame, TrendingUp, Calendar, Target } from 'lucide-react';

export default function Home() {
  const {
    level,
    xp,
    streak,
    challenges,
    dayLogs,
    calorieGoal,
    addEntry,
    removeEntry,
    setCalorieGoal,
    getTodayLog,
  } = useGameStore();

  const todayLog = getTodayLog();

  const handleAddEntry = (entry: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    quantity: number;
  }) => {
    addEntry(entry);
  };

  const handleRemoveEntry = (id: string) => {
    removeEntry(id);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <NotifToast />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-gradient-blue">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-5xl font-black text-white font-bebas tracking-wide">
              CALMAX
            </h1>
          </div>
          <p className="text-muted-foreground">Gamified Calorie Tracker</p>
        </div>

        {/* XP Bar */}
        <Card className="mb-6 bg-card/50 backdrop-blur border-border">
          <CardContent className="pt-6">
            <XPBar level={level} xp={xp} />
          </CardContent>
        </Card>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-500/20">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">{streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-500/20">
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold tabular-nums">{todayLog.entries.length}</div>
                <div className="text-xs text-muted-foreground">Meals Today</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="pt-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/20">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <div className="text-lg font-bold">
                  {todayLog.date 
                    ? new Date(todayLog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                    : '--'
                  }
                </div>
                <div className="text-xs text-muted-foreground">Date</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="tracker" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tracker">Tracker</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Tracker Tab */}
          <TabsContent value="tracker" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Calorie Ring */}
              <Card className="bg-card/50 backdrop-blur border-border">
                <CardHeader>
                  <CardTitle>Calories</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center py-4">
                  <CalorieRing current={todayLog.totalCalories} goal={calorieGoal} />
                </CardContent>
              </Card>

              {/* Macros */}
              <Card className="bg-card/50 backdrop-blur border-border">
                <CardHeader>
                  <CardTitle>Macros</CardTitle>
                </CardHeader>
                <CardContent className="py-4">
                  <MacroBar
                    protein={todayLog.totalProtein}
                    carbs={todayLog.totalCarbs}
                    fat={todayLog.totalFat}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Add Food */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle>Add Food</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <FoodForm
                  onAddEntry={handleAddEntry}
                  existingEntries={todayLog.entries.map(e => ({
                    id: e.id,
                    name: e.name,
                    calories: e.calories * e.quantity,
                  }))}
                  onRemoveEntry={handleRemoveEntry}
                />
              </CardContent>
            </Card>

            {/* Calorie Goal Setting */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Daily Calorie Goal</Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        type="number"
                        value={calorieGoal}
                        onChange={(e) => setCalorieGoal(parseInt(e.target.value) || 2500)}
                        className="w-32"
                      />
                      <span className="text-sm text-muted-foreground">kcal/day</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges">
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardContent className="pt-6">
                <ChallengesPanel challenges={challenges} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats">
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardContent className="pt-6">
                <StatsGrid dayLogs={dayLogs} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
