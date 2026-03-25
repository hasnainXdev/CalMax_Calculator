'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGameStore } from '@/hooks/useGameStore';
import { GoalType, GenderType } from '@/lib/store';
import { User, Weight, Target, Save, Ruler } from 'lucide-react';

const goalLabels: Record<string, string> = {
  muscle_gain: 'Muscle Gain',
  weight_loss: 'Weight Loss',
  maintain: 'Maintain Weight',
  general_fitness: 'General Fitness',
};

export function ProfileSettings() {
  const { profile, updateProfile } = useGameStore();
  const [age, setAge] = useState<string>(profile?.age?.toString() || '');
  const [weight, setWeight] = useState<string>(profile?.weight?.toString() || '');
  const [height, setHeight] = useState<string>(profile?.height?.toString() || '');
  const [gender, setGender] = useState<GenderType>(profile?.gender || 'male');
  const [goal, setGoal] = useState<GoalType>(profile?.goal || 'muscle_gain');
  const [saved, setSaved] = useState(false);
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

    updateProfile({ age: ageNum, weight: weightNum, height: heightNum, gender, goal });
    setError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) {
    return null;
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Update Your Profile
        </CardTitle>
        <CardDescription>
          Adjust your details to recalculate your daily needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Gender Selection */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
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
            <Label htmlFor="edit-age" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Age
            </Label>
            <Input
              id="edit-age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min={13}
              max={100}
              className="bg-background/50"
            />
          </div>

          {/* Height Input */}
          <div className="space-y-2">
            <Label htmlFor="edit-height" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Height (cm)
            </Label>
            <Input
              id="edit-height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min={100}
              max={220}
              step={1}
              className="bg-background/50"
            />
          </div>

          {/* Weight Input */}
          <div className="space-y-2">
            <Label htmlFor="edit-weight" className="flex items-center gap-2">
              <Weight className="h-4 w-4" />
              Weight (kg)
            </Label>
            <Input
              id="edit-weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
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
              Goal
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(goalLabels).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setGoal(key as GoalType)}
                  className={`p-3 rounded-lg border-2 transition-all text-left
                    ${goal === key
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-secondary/30 hover:border-primary/50'}`}
                >
                  <div className="font-semibold text-sm">
                    {key === 'muscle_gain' && '💪'}
                    {key === 'weight_loss' && '🔥'}
                    {key === 'maintain' && '⚖️'}
                    {key === 'general_fitness' && '🏃'}
                    {' '}{label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {saved && (
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-500 text-sm flex items-center gap-2">
              <Save className="h-4 w-4" />
              Profile updated successfully!
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </form>

        {/* Current Stats */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Current Daily Targets</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <div className="text-xs text-muted-foreground">Calories</div>
              <div className="text-xl font-bold text-orange-500">{profile.dailyCalorieNeed} kcal</div>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="text-xs text-muted-foreground">Protein</div>
              <div className="text-xl font-bold text-blue-500">{profile.dailyProteinNeed}g</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
