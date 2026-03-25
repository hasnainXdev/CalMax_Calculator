'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useGameStore } from '@/hooks/useGameStore';
import { Dumbbell, Flame, Target, User, Weight, Ruler } from 'lucide-react';

const goalLabels: Record<string, string> = {
  muscle_gain: 'Muscle Gain',
  weight_loss: 'Weight Loss',
  maintain: 'Maintain Weight',
  general_fitness: 'General Fitness',
};

const goalIcons: Record<string, string> = {
  muscle_gain: '💪',
  weight_loss: '🔥',
  maintain: '⚖️',
  general_fitness: '🏃',
};

export function ProfileCard() {
  const { profile } = useGameStore();

  if (!profile) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/30">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3 mb-4">
          <Ruler className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold">Your Profile</h3>
            <p className="text-sm text-muted-foreground">
              {profile.gender === 'female' ? '👩' : '👨'} {profile.age} years • {profile.height || 170}cm • {profile.weight}kg • {goalLabels[profile.goal]}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>Daily Calories: <strong>{profile.dailyCalorieNeed}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            <span>Daily Protein: <strong>{profile.dailyProteinNeed}g</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
