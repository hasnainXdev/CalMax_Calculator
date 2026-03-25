'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/hooks/useGameStore';
import { GoalType, GenderType } from '@/lib/store';
import { User, Weight, Target, ArrowRight, Ruler } from 'lucide-react';

interface ProfileFormProps {
  onComplete?: () => void;
}

export function ProfileForm({ onComplete }: ProfileFormProps) {
  const { setProfile } = useGameStore();
  const [age, setAge] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [gender, setGender] = useState<GenderType>('male');
  const [goal, setGoal] = useState<GoalType>('muscle_gain');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!ageNum || ageNum < 13 || ageNum > 100) {
      setError('Please enter a valid age (13-100)');
      return;
    }

    if (!weightNum || weightNum < 30 || weightNum > 200) {
      setError('Please enter a valid weight (30-200 kg)');
      return;
    }

    if (!heightNum || heightNum < 100 || heightNum > 220) {
      setError('Please enter a valid height (100-220 cm)');
      return;
    }

    setProfile(ageNum, weightNum, heightNum, gender, goal);
    setError('');
    onComplete?.();
  };

  return (
    <Card className="bg-gradient-to-r from-primary/20 to-blue-500/20 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Tell Us About Yourself
        </CardTitle>
        <CardDescription>
          We'll use this to personalize your calorie and protein goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender Selection */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Gender
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`p-3 rounded-lg border-2 transition-all text-left
                  ${gender === 'male'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/30 hover:border-primary/50'}`}
              >
                <div className="font-semibold text-sm">👨 Male</div>
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`p-3 rounded-lg border-2 transition-all text-left
                  ${gender === 'female'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/30 hover:border-primary/50'}`}
              >
                <div className="font-semibold text-sm">👩 Female</div>
              </button>
            </div>
          </div>

          {/* Age Input */}
          <div className="space-y-2">
            <Label htmlFor="age" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Age
            </Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g., 25"
              min={13}
              max={100}
              className="bg-background/50"
            />
          </div>

          {/* Height Input */}
          <div className="space-y-2">
            <Label htmlFor="height" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Height (cm)
            </Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="e.g., 170"
              min={100}
              max={220}
              step={1}
              className="bg-background/50"
            />
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Weight (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g., 70"
              min={30}
              max={200}
              step={0.1}
              className="bg-background/50"
            />
          </div>

          {/* Goal Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              What's your goal?
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGoal('muscle_gain')}
                className={`p-3 rounded-lg border-2 transition-all text-left
                  ${goal === 'muscle_gain'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/30 hover:border-primary/50'}`}
              >
                <div className="font-semibold text-sm">💪 Muscle Gain</div>
                <div className="text-xs text-muted-foreground">Build muscle mass</div>
              </button>
              <button
                type="button"
                onClick={() => setGoal('weight_loss')}
                className={`p-3 rounded-lg border-2 transition-all text-left
                  ${goal === 'weight_loss'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/30 hover:border-primary/50'}`}
              >
                <div className="font-semibold text-sm">🔥 Weight Loss</div>
                <div className="text-xs text-muted-foreground">Lose fat</div>
              </button>
              <button
                type="button"
                onClick={() => setGoal('maintain')}
                className={`p-3 rounded-lg border-2 transition-all text-left
                  ${goal === 'maintain'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/30 hover:border-primary/50'}`}
              >
                <div className="font-semibold text-sm">⚖️ Maintain</div>
                <div className="text-xs text-muted-foreground">Stay at current weight</div>
              </button>
              <button
                type="button"
                onClick={() => setGoal('general_fitness')}
                className={`p-3 rounded-lg border-2 transition-all text-left
                  ${goal === 'general_fitness'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-secondary/30 hover:border-primary/50'}`}
              >
                <div className="font-semibold text-sm">🏃 General Fitness</div>
                <div className="text-xs text-muted-foreground">Overall health</div>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" size="lg">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
