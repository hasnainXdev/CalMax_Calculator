'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Challenge } from '@/lib/store';
import { Trophy, Flame, Target, Dumbbell, Star, Crown, Zap, Medal, Calendar } from 'lucide-react';

interface ChallengesPanelProps {
  challenges: Challenge[];
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  '🎯': Target,
  '🔥': Flame,
  '📊': Trophy,
  '💪': Dumbbell,
  '⚡': Zap,
  '🏆': Medal,
  '🥩': Dumbbell,
  '👑': Crown,
  '🌟': Star,
};

export function ChallengesPanel({ challenges }: ChallengesPanelProps) {
  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">Challenges</h3>
          <p className="text-sm text-muted-foreground">Complete quests to earn bonus XP</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{completedCount}</div>
          <div className="text-xs text-muted-foreground">/ {challenges.length} Complete</div>
        </div>
      </div>

      <div className="grid gap-3">
        {challenges.map((challenge) => {
          const IconComponent = iconMap[challenge.icon] || Trophy;
          const progress = Math.min(100, (challenge.current / challenge.target) * 100);
          
          return (
            <Card
              key={challenge.id}
              className={`transition-all ${
                challenge.completed 
                  ? 'bg-success/10 border-success/30' 
                  : 'bg-card border-border'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    challenge.completed 
                      ? 'bg-success/20 text-success' 
                      : 'bg-secondary text-muted-foreground'
                  }`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${challenge.completed ? 'text-success' : ''}`}>
                        {challenge.name}
                      </span>
                      {challenge.completed && (
                        <span className="text-success text-sm">✓</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <Progress value={progress} className="flex-1 h-2" />
                      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {challenge.current} / {challenge.target}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
