'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Nut, DollarSign, Zap, Weight, Dumbbell, TrendingDown, Award, Target, Flame, Ruler } from 'lucide-react';
import { useGameStore } from '@/hooks/useGameStore';
import { ProfileForm } from '@/components/ProfileForm';

interface FoodItem {
  name: string;
  pricePerUnit: number;
  unit: string;
  caloriesPerUnit: number;
  proteinPerUnit: number;
  icon: string;
  muscleGainScore: number;
  costEffectiveness: number;
}

const foodItems: FoodItem[] = [
  {
    name: 'Peanut Butter',
    pricePerUnit: 1.8,
    unit: 'g',
    caloriesPerUnit: 5.88, // 588 cal/100g (USDA)
    proteinPerUnit: 0.25, // 25g/100g (USDA)
    icon: '🥜',
    muscleGainScore: 7,
    costEffectiveness: 0.139
  },
  {
    name: 'Bananas',
    pricePerUnit: 20,
    unit: 'piece',
    caloriesPerUnit: 105, // 105 cal/medium banana (USDA)
    proteinPerUnit: 1.3, // 1.3g/medium banana (USDA)
    icon: '🍌',
    muscleGainScore: 5,
    costEffectiveness: 0.065
  },
  {
    name: 'Dates',
    pricePerUnit: 0.5,
    unit: 'piece',
    caloriesPerUnit: 66, // 66 cal/Medjool date (USDA) - FIXED from 23
    proteinPerUnit: 0.4, // 0.4g/date (USDA) - FIXED from 0.2
    icon: '🌴',
    muscleGainScore: 4,
    costEffectiveness: 0.8
  },
  {
    name: 'Almonds',
    pricePerUnit: 4,
    unit: 'g',
    caloriesPerUnit: 5.79, // 579 cal/100g (USDA)
    proteinPerUnit: 0.21, // 21g/100g (USDA)
    icon: '🌰',
    muscleGainScore: 7,
    costEffectiveness: 0.053
  },
  {
    name: 'Milk',
    pricePerUnit: 0.9,
    unit: 'cup (250ml)',
    caloriesPerUnit: 149, // 149 cal/cup (USDA) - FIXED from 155
    proteinPerUnit: 8, // 8g/cup (USDA)
    icon: '🥛',
    muscleGainScore: 9,
    costEffectiveness: 8.89
  },
  {
    name: 'Eggs',
    pricePerUnit: 35,
    unit: 'piece',
    caloriesPerUnit: 78, // 78 cal/large egg (USDA) - FIXED from 74
    proteinPerUnit: 6.3, // 6.3g/egg (USDA) - FIXED from 6.3
    icon: '🥚',
    muscleGainScore: 10,
    costEffectiveness: 0.18
  },
];

export function ProCalculator() {
  const { profile } = useGameStore();
  const [budget, setBudget] = useState<number>(3000);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(['Bananas', 'Dates', 'Almonds']);
  const [showProfileForm, setShowProfileForm] = useState(false);

  // Use profile from store or default values (with backward compatibility)
  const userProfile = profile ? {
    age: profile.age,
    weight: profile.weight,
    height: profile.height || 170, // Default for old profiles
    gender: profile.gender || 'male', // Default for old profiles
    goal: profile.goal,
    dailyCalorieNeed: profile.dailyCalorieNeed,
    dailyProteinNeed: profile.dailyProteinNeed,
  } : {
    age: 17,
    weight: 49,
    height: 170,
    gender: 'male' as import('@/lib/store').GenderType,
    goal: 'muscle_gain' as const,
    dailyCalorieNeed: 2400,
    dailyProteinNeed: 98,
  };

  const calculateDistribution = () => {
    // Muscle gain optimized distribution
    const distribution = {
      'Eggs': 0.30,           // Best protein quality
      'Milk': 0.25,           // Best value protein
      'Peanut Butter': 0.20,  // Calorie dense + protein
      'Bananas': 0.10,        // Pre-workout energy
      'Dates': 0.10,          // Quick energy
      'Almonds': 0.05,        // Healthy fats (expensive)
    };

    return foodItems.map((item) => {
      const allocatedBudget = budget * (distribution[item.name as keyof typeof distribution] || 0.167);
      const quantity = Math.floor(allocatedBudget / item.pricePerUnit);
      const totalCalories = quantity * item.caloriesPerUnit;
      const totalProtein = quantity * item.proteinPerUnit;
      const dailyProtein = totalProtein / 30;

      return {
        ...item,
        quantity,
        totalCalories: Math.round(totalCalories),
        totalProtein: Math.round(totalProtein),
        dailyProtein: dailyProtein.toFixed(1),
        cost: Math.round(allocatedBudget),
      };
    });
  };

  const distribution = calculateDistribution();
  const totalCalories = distribution.reduce((sum, item) => sum + item.totalCalories, 0);
  const totalProtein = distribution.reduce((sum, item) => sum + item.totalProtein, 0);
  const dailyCalories = Math.round(totalCalories / 30);
  const dailyProtein = (totalProtein / 30).toFixed(1);

  const calorieProgress = (dailyCalories / userProfile.dailyCalorieNeed) * 100;
  const proteinProgress = (parseFloat(dailyProtein) / userProfile.dailyProteinNeed) * 100;

  const sortedByCostEffectiveness = [...distribution].sort((a, b) => b.costEffectiveness - a.costEffectiveness);
  const sortedByMuscleGain = [...distribution].sort((a, b) => b.muscleGainScore - a.muscleGainScore);

  // Calculate remaining budget after essential purchases (Eggs + Milk + Peanut Butter = 75%)
  const essentialCost = budget * 0.75;
  const remainingBudget = budget - essentialCost;

  // Comparison items (Bananas, Dates, Almonds)
  const comparisonItems = distribution.filter(item => 
    selectedForComparison.includes(item.name)
  );

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      {!profile ? (
        <ProfileForm onComplete={() => setShowProfileForm(false)} />
      ) : (
        <>
          <Card className="bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Your Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      {userProfile.gender === 'male' ? '👨' : '👩'} {userProfile.age}yo • {userProfile.height}cm • {userProfile.weight}kg • {userProfile.goal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileForm(true)}
                  className="text-xs text-primary hover:underline"
                >
                  Change
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span>Daily Calories: <strong>{userProfile.dailyCalorieNeed}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  <span>Daily Protein: <strong>{userProfile.dailyProteinNeed}g</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {showProfileForm && (
            <ProfileForm onComplete={() => setShowProfileForm(false)} />
          )}
        </>
      )}

      {/* Budget Slider */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-500" />
            Monthly Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">1,000 PKR</span>
            <div className="text-3xl font-bold text-green-500">{budget.toLocaleString()} PKR</div>
            <span className="text-sm text-muted-foreground">8,000 PKR</span>
          </div>
          <Slider
            value={[budget]}
            min={1000}
            max={8000}
            step={100}
            onValueChange={(value) => setBudget(value[0])}
            className="py-4"
          />
          <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground">
            <div className="text-center">Basic</div>
            <div className="text-center">Starter</div>
            <div className="text-center">Pro</div>
            <div className="text-center">Elite</div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-2xl font-bold text-orange-500">{dailyCalories.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Daily Calories</div>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all" 
                style={{ width: `${Math.min(calorieProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {calorieProgress.toFixed(0)}% of {userProfile.dailyCalorieNeed} goal
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border">
          <CardContent className="pt-4 space-y-2">
            <div className="flex items-center gap-2">
              <Weight className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-500">{dailyProtein}g</div>
                <div className="text-xs text-muted-foreground">Daily Protein</div>
              </div>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all" 
                style={{ width: `${Math.min(proteinProgress, 100)}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              {proteinProgress.toFixed(0)}% of {userProfile.dailyProteinNeed}g goal
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Effectiveness Ranking */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-green-500" />
            Best Value for Money (Protein per PKR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedByCostEffectiveness.slice(0, 4).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{index + 1}. {item.name}</div>
                    <div className="text-xs text-muted-foreground">Muscle Score: {item.muscleGainScore}/10</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-500">
                    {(item.costEffectiveness * 100).toFixed(1)}g protein/100PKR
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Distribution Visualization */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Budget Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="flex h-8 w-full rounded-full overflow-hidden">
            {distribution.map((item) => (
              <div
                key={item.name}
                className="h-full transition-all"
                style={{
                  width: `${(item.cost / budget) * 100}%`,
                  backgroundColor: item.name === 'Eggs' ? '#f59e0b' :
                                   item.name === 'Milk' ? '#3b82f6' :
                                   item.name === 'Peanut Butter' ? '#8b5cf6' :
                                   item.name === 'Bananas' ? '#eab308' :
                                   item.name === 'Dates' ? '#a855f7' :
                                   '#f97316'
                }}
                title={`${item.name}: ${((item.cost / budget) * 100).toFixed(0)}%`}
              />
            ))}
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-xs">
            {distribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: item.name === 'Eggs' ? '#f59e0b' :
                                     item.name === 'Milk' ? '#3b82f6' :
                                     item.name === 'Peanut Butter' ? '#8b5cf6' :
                                     item.name === 'Bananas' ? '#eab308' :
                                     item.name === 'Dates' ? '#a855f7' :
                                     '#f97316'
                  }}
                />
                <span className="text-muted-foreground">{item.name}: {((item.cost / budget) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Choice Helper - For Confused Buyers */}
      <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-green-500" />
            🤔 Confused? Here's Your Answer ({Math.round(remainingBudget)} PKR left)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            After buying <strong>Eggs + Milk + Peanut Butter</strong> (the essentials), you have <strong>{Math.round(remainingBudget)} PKR</strong> left.
            Choose ONE based on your priority:
          </p>

          <div className="grid gap-3">
            {/* Bananas Option */}
            <button
              onClick={() => setSelectedForComparison(['Bananas'])}
              className={`p-4 rounded-lg border-2 transition-all text-left
                ${selectedForComparison.includes('Bananas') 
                  ? 'border-yellow-500 bg-yellow-500/10' 
                  : 'border-border bg-secondary/30 hover:border-yellow-500/50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🍌</span>
                  <div>
                    <div className="font-semibold">Bananas - For Workout Energy</div>
                    <div className="text-xs text-muted-foreground">Best pre-workout fuel</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-yellow-500">{Math.floor(remainingBudget / 20)} pieces</div>
                  <div className="text-xs text-muted-foreground">{Math.round(remainingBudget)} PKR</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold">{Math.round((remainingBudget / 20) * 105)} cal</div>
                  <div className="text-muted-foreground">Energy</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold">{((remainingBudget / 20) * 1.3).toFixed(1)}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold text-green-500">⭐ Best for Exercise</div>
                  <div className="text-muted-foreground">Quick carbs</div>
                </div>
              </div>
            </button>

            {/* Dates Option */}
            <button
              onClick={() => setSelectedForComparison(['Dates'])}
              className={`p-4 rounded-lg border-2 transition-all text-left
                ${selectedForComparison.includes('Dates') 
                  ? 'border-purple-500 bg-purple-500/10' 
                  : 'border-border bg-secondary/30 hover:border-purple-500/50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌴</span>
                  <div>
                    <div className="font-semibold">Dates - Cheap Energy Boost</div>
                    <div className="text-xs text-muted-foreground">Most budget-friendly</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-500">{Math.floor(remainingBudget / 0.5)} pieces</div>
                  <div className="text-xs text-muted-foreground">{Math.round(remainingBudget)} PKR</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold">{Math.round((remainingBudget / 0.5) * 23)} cal</div>
                  <div className="text-muted-foreground">Energy</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold">{((remainingBudget / 0.5) * 0.2).toFixed(1)}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold text-green-500">💰 Cheapest</div>
                  <div className="text-muted-foreground">0.5 PKR/piece</div>
                </div>
              </div>
            </button>

            {/* Almonds Option */}
            <button
              onClick={() => setSelectedForComparison(['Almonds'])}
              className={`p-4 rounded-lg border-2 transition-all text-left
                ${selectedForComparison.includes('Almonds') 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-border bg-secondary/30 hover:border-orange-500/50'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌰</span>
                  <div>
                    <div className="font-semibold">Almonds - Premium Choice</div>
                    <div className="text-xs text-muted-foreground">Healthy fats + protein</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-orange-500">{Math.floor(remainingBudget / 4)}g</div>
                  <div className="text-xs text-muted-foreground">{Math.round(remainingBudget)} PKR</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold">{Math.round((remainingBudget / 4) * 5.79)} cal</div>
                  <div className="text-muted-foreground">Energy</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold">{((remainingBudget / 4) * 0.21).toFixed(1)}g</div>
                  <div className="text-muted-foreground">Protein</div>
                </div>
                <div className="bg-background/50 rounded p-2 text-center">
                  <div className="font-semibold text-green-500">💪 Premium</div>
                  <div className="text-muted-foreground">Healthy fats</div>
                </div>
              </div>
            </button>
          </div>

          {/* Recommendation */}
          <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-green-500/20">
                <Award className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="font-semibold text-green-500">Our Recommendation for You</div>
                <p className="text-sm text-muted-foreground mt-1">
                  Since you do <strong>pushups & squats</strong>, choose <strong>Bananas</strong> for pre-workout energy. 
                  They give you quick carbs to fuel your exercises. Add Dates if you have extra budget - they're the cheapest calorie source!
                </p>
                <div className="mt-2 text-xs text-green-400">
                  💡 Pro tip: Skip Almonds for now (too expensive). Buy more Eggs + Milk instead for better muscle gains.
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Distribution */}
      <Card className="bg-card/50 backdrop-blur border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Nut className="h-5 w-5 text-primary" />
            Your Monthly Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {distribution.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.quantity} {item.unit} • {item.totalCalories} cal • {item.totalProtein}g protein/month
                    </div>
                    <div className="text-xs text-primary font-medium">
                      ~{item.dailyProtein}g protein/day
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-500">{item.cost} PKR</div>
                  <div className="text-xs text-muted-foreground">
                    {((item.cost / budget) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Muscle Gain Ranking */}
      <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-500" />
            Best for Muscle Gain
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedByMuscleGain.slice(0, 3).map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${index === 0 ? 'bg-yellow-500 text-black' : 
                      index === 1 ? 'bg-gray-400 text-black' : 
                      'bg-orange-600 text-white'}`}>
                    {index + 1}
                  </span>
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Score: {item.muscleGainScore}/10
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Personalized Tips */}
      <Card className="bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/30">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h4 className="font-semibold text-primary flex items-center gap-2">
              <Dumbbell className="h-4 w-4" />
              Tips for Your Goals ({userProfile.age}yo, {userProfile.weight}kg)
            </h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>Milk is your best friend</strong> - 8.89g protein per 100 PKR, cheapest complete protein</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>Eggs have the best protein quality</strong> - gold standard for muscle building</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>Eat bananas before workout</strong> - quick energy for your pushups & squats</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>Peanut butter post-workout</strong> - calories + protein for recovery</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">✓</span>
                <span><strong>Aim for 3000+ PKR/month</strong> for optimal muscle gain at your weight</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
