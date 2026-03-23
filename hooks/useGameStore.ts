'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  FoodEntry,
  Notification,
  createInitialState,
  updateStreak,
  calculateXp,
  updateChallenges,
  getTodayString,
  createEmptyDayLog,
  LEVELS,
} from '@/lib/store';

interface GameStore extends GameState {
  // Actions
  addEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => { xpGained: number; leveledUp: boolean };
  removeEntry: (entryId: string) => void;
  setCalorieGoal: (goal: number) => void;
  dismissNotification: (notificationId: string) => void;
  getTodayLog: () => import('@/lib/store').DayLog;
  resetDay: () => void;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      addEntry: (entryData) => {
        const state = get();
        const today = getTodayString();
        
        // Get or create today's log
        let dayLog = state.dayLogs[today];
        let isNewDay = false;
        
        if (!dayLog) {
          dayLog = createEmptyDayLog(today, state.calorieGoal);
          isNewDay = true;
        }

        // Create the entry
        const entry: FoodEntry = {
          ...entryData,
          id: generateId(),
          timestamp: Date.now(),
        };

        // Update day log totals
        const quantity = entry.quantity || 1;
        dayLog = {
          ...dayLog,
          entries: [...dayLog.entries, entry],
          totalCalories: dayLog.totalCalories + (entry.calories * quantity),
          totalProtein: dayLog.totalProtein + (entry.protein * quantity),
          totalCarbs: dayLog.totalCarbs + (entry.carbs * quantity),
          totalFat: dayLog.totalFat + (entry.fat * quantity),
        };

        // Calculate XP
        const xpGained = calculateXp(entry, dayLog);

        // Update streak
        const { streak, broken } = updateStreak(state, today);

        // Update total days
        const totalDays = isNewDay ? state.totalDays + 1 : state.totalDays;

        // Update XP and level
        let newTotalXp = state.totalXp + xpGained;
        let newLevel = state.level;
        let leveledUp = false;

        // Check for level up
        for (const levelData of LEVELS) {
          if (newTotalXp >= levelData.xpThreshold && levelData.level > newLevel) {
            newLevel = levelData.level;
            leveledUp = true;
          }
        }

        // Create notifications
        const newNotifications: Notification[] = [];
        
        newNotifications.push({
          id: generateId(),
          type: 'xp',
          title: `+${xpGained} XP`,
          message: `Added ${entry.name}`,
          timestamp: Date.now(),
        });

        if (leveledUp) {
          newNotifications.push({
            id: generateId(),
            type: 'level_up',
            title: `Level ${newLevel}!`,
            message: 'You leveled up! Keep going!',
            timestamp: Date.now(),
          });
        }

        if (broken) {
          newNotifications.push({
            id: generateId(),
            type: 'streak',
            title: 'Streak Reset',
            message: 'Your streak was reset. Start fresh!',
            timestamp: Date.now(),
          });
        }

        // Update challenges
        const updatedState = {
          ...state,
          level: newLevel,
          xp: newTotalXp,
          totalXp: newTotalXp,
          streak,
          lastEntryDate: today,
          totalDays,
          dayLogs: { ...state.dayLogs, [today]: dayLog },
          notifications: [...state.notifications, ...newNotifications],
        };

        const updatedChallenges = updateChallenges(updatedState, dayLog);
        
        // Add challenge completion notifications
        updatedChallenges.forEach((challenge, index) => {
          const oldChallenge = state.challenges[index];
          if (challenge.completed && !oldChallenge?.completed) {
            newNotifications.push({
              id: generateId(),
              type: 'challenge',
              title: 'Challenge Complete!',
              message: challenge.name,
              timestamp: Date.now(),
            });
          }
        });

        set({
          ...updatedState,
          challenges: updatedChallenges,
        });

        return { xpGained, leveledUp };
      },

      removeEntry: (entryId) => {
        const state = get();
        const today = getTodayString();
        const dayLog = state.dayLogs[today];
        
        if (!dayLog) return;

        const entry = dayLog.entries.find(e => e.id === entryId);
        if (!entry) return;

        const quantity = entry.quantity || 1;
        
        dayLog.entries = dayLog.entries.filter(e => e.id !== entryId);
        dayLog.totalCalories -= entry.calories * quantity;
        dayLog.totalProtein -= entry.protein * quantity;
        dayLog.totalCarbs -= entry.carbs * quantity;
        dayLog.totalFat -= entry.fat * quantity;

        set({
          ...state,
          dayLogs: { ...state.dayLogs, [today]: dayLog },
        });
      },

      setCalorieGoal: (goal) => {
        const state = get();
        const today = getTodayString();
        const dayLog = state.dayLogs[today];

        if (dayLog) {
          dayLog.calorieGoal = goal;
        }

        set({
          ...state,
          calorieGoal: goal,
          dayLogs: { ...state.dayLogs, [today]: dayLog },
        });
      },

      dismissNotification: (notificationId) => {
        const state = get();
        set({
          ...state,
          notifications: state.notifications.filter(n => n.id !== notificationId),
        });
      },

      getTodayLog: () => {
        const state = get();
        const today = getTodayString();
        return state.dayLogs[today] || createEmptyDayLog(today, state.calorieGoal);
      },

      resetDay: () => {
        const state = get();
        const today = getTodayString();
        set({
          ...state,
          dayLogs: {
            ...state.dayLogs,
            [today]: createEmptyDayLog(today, state.calorieGoal),
          },
        });
      },
    }),
    {
      name: 'calmax-game-storage',
      partialize: (state) => ({
        level: state.level,
        xp: state.xp,
        totalXp: state.totalXp,
        streak: state.streak,
        lastEntryDate: state.lastEntryDate,
        totalDays: state.totalDays,
        calorieGoal: state.calorieGoal,
        challenges: state.challenges,
        dayLogs: state.dayLogs,
      }),
    }
  )
);
