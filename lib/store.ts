// Game Types
export interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  timestamp: number;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  entries: FoodEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  calorieGoal: number;
  xpEarned: number;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'streak' | 'total_days' | 'calorie_goal' | 'protein_goal';
  target: number;
  current: number;
  completed: boolean;
  icon: string;
}

export type GoalType = 'muscle_gain' | 'weight_loss' | 'maintain' | 'general_fitness';
export type GenderType = 'male' | 'female';

export interface UserProfile {
  age: number;
  weight: number; // in kg
  height: number; // in cm
  gender: GenderType;
  goal: GoalType;
  dailyCalorieNeed: number;
  dailyProteinNeed: number;
}

export interface GameState {
  level: number;
  xp: number;
  totalXp: number;
  streak: number;
  lastEntryDate: string | null;
  totalDays: number;
  calorieGoal: number;
  challenges: Challenge[];
  dayLogs: Record<string, DayLog>;
  notifications: Notification[];
  profile: UserProfile | null;
}

export interface Notification {
  id: string;
  type: 'xp' | 'level_up' | 'challenge' | 'streak';
  title: string;
  message: string;
  timestamp: number;
}

// XP System
export const LEVELS = [
  { level: 1, xpThreshold: 0 },
  { level: 2, xpThreshold: 100 },
  { level: 3, xpThreshold: 250 },
  { level: 4, xpThreshold: 500 },
  { level: 5, xpThreshold: 800 },
  { level: 6, xpThreshold: 1200 },
  { level: 7, xpThreshold: 1700 },
  { level: 8, xpThreshold: 2300 },
  { level: 9, xpThreshold: 3000 },
  { level: 10, xpThreshold: 4000 },
];

export function getXpForLevel(level: number): number {
  const levelData = LEVELS.find(l => l.level === level);
  return levelData ? levelData.xpThreshold : 5000;
}

export function getNextLevelXp(level: number): number {
  const nextLevel = LEVELS.find(l => l.level === level + 1);
  return nextLevel ? nextLevel.xpThreshold : 5000;
}

export function getXpProgress(level: number, xp: number): number {
  const currentLevelXp = getXpForLevel(level);
  const nextLevelXp = getNextLevelXp(level);
  const progress = xp - currentLevelXp;
  const totalNeeded = nextLevelXp - currentLevelXp;
  return Math.min(100, Math.max(0, (progress / totalNeeded) * 100));
}

// Initial Challenges
export const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'first_step', name: 'First Step', description: 'Log your first meal', type: 'total_days', target: 1, current: 0, completed: false, icon: '🎯' },
  { id: 'week_warrior', name: 'Week Warrior', description: '7 day streak', type: 'streak', target: 7, current: 0, completed: false, icon: '🔥' },
  { id: 'calorie_novice', name: 'Calorie Novice', description: 'Hit calorie goal 5 times', type: 'calorie_goal', target: 5, current: 0, completed: false, icon: '📊' },
  { id: 'protein_starter', name: 'Protein Starter', description: 'Reach 50g protein in a day', type: 'protein_goal', target: 50, current: 0, completed: false, icon: '💪' },
  { id: 'fortnight_hero', name: 'Fortnight Hero', description: '14 day streak', type: 'streak', target: 14, current: 0, completed: false, icon: '⚡' },
  { id: 'calorie_master', name: 'Calorie Master', description: 'Hit calorie goal 20 times', type: 'calorie_goal', target: 20, current: 0, completed: false, icon: '🏆' },
  { id: 'protein_warrior', name: 'Protein Warrior', description: 'Reach 100g protein in a day', type: 'protein_goal', target: 100, current: 0, completed: false, icon: '🥩' },
  { id: 'monthly_legend', name: 'Monthly Legend', description: '30 day streak', type: 'streak', target: 30, current: 0, completed: false, icon: '👑' },
  { id: 'year_champion', name: 'Year Champion', description: 'Log 365 total days', type: 'total_days', target: 365, current: 0, completed: false, icon: '🌟' },
];

// Local Storage
const STORAGE_KEY = 'calmax_game_state';

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return null;
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

export function createInitialState(): GameState {
  return {
    level: 1,
    xp: 0,
    totalXp: 0,
    streak: 0,
    lastEntryDate: null,
    totalDays: 0,
    calorieGoal: 2500,
    challenges: INITIAL_CHALLENGES.map(c => ({ ...c })),
    dayLogs: {},
    notifications: [],
    profile: null,
  };
}

// Streak Logic
export function updateStreak(state: GameState, entryDate: string): { streak: number; broken: boolean } {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  if (state.lastEntryDate === today) {
    return { streak: state.streak, broken: false };
  }
  
  if (state.lastEntryDate === yesterday) {
    return { streak: state.streak + 1, broken: false };
  }
  
  if (state.lastEntryDate === null) {
    return { streak: 1, broken: false };
  }
  
  // Streak broken
  return { streak: 1, broken: true };
}

// XP Calculation
export function calculateXp(entry: FoodEntry, dayLog: DayLog): number {
  let xp = 10; // Base XP for logging
  
  // Bonus for hitting calorie target (within 10% of goal)
  const calorieRatio = dayLog.totalCalories / dayLog.calorieGoal;
  if (calorieRatio >= 0.9 && calorieRatio <= 1.1) {
    xp += 30;
  }
  
  // Bonus for high protein
  if (entry.protein * entry.quantity >= 50) {
    xp += 20;
  }
  
  return xp;
}

// Challenge Progress
export function updateChallenges(state: GameState, dayLog: DayLog): Challenge[] {
  return state.challenges.map(challenge => {
    if (challenge.completed) return challenge;
    
    let newCurrent = challenge.current;
    
    switch (challenge.type) {
      case 'streak':
        newCurrent = state.streak;
        break;
      case 'total_days':
        newCurrent = state.totalDays;
        break;
      case 'calorie_goal':
        const calorieRatio = dayLog.totalCalories / dayLog.calorieGoal;
        if (calorieRatio >= 0.9 && calorieRatio <= 1.1) {
          newCurrent = challenge.current + 1;
        }
        break;
      case 'protein_goal':
        if (dayLog.totalProtein >= challenge.target) {
          newCurrent = challenge.target;
        }
        break;
    }
    
    return {
      ...challenge,
      current: Math.min(newCurrent, challenge.target),
      completed: newCurrent >= challenge.target,
    };
  });
}

// Helper to get today's date string
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

// Helper to create empty day log
export function createEmptyDayLog(date: string, calorieGoal: number): DayLog {
  return {
    date,
    entries: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    calorieGoal,
    xpEarned: 0,
  };
}

// Calculate daily calorie and protein needs based on user profile
// Uses Mifflin-St Jeor Equation (most accurate per 2025 research)
export function calculateDailyNeeds(
  age: number,
  weight: number,
  height: number,
  gender: GenderType,
  goal: GoalType
): { calories: number; protein: number } {
  // BMR calculation using Mifflin-St Jeor Equation
  // Men: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) + 5
  // Women: BMR = (10 × weight in kg) + (6.25 × height in cm) − (5 × age in years) − 161
  const bmr = gender === 'male'
    ? (10 * weight) + (6.25 * height) - (5 * age) + 5
    : (10 * weight) + (6.25 * height) - (5 * age) - 161;

  // Activity multiplier (sedentary to lightly active)
  const activityMultiplier = 1.375;
  const tdee = bmr * activityMultiplier;

  // Adjust based on goal
  let calories: number;
  let protein: number;

  switch (goal) {
    case 'muscle_gain':
      calories = Math.round(tdee + 300); // Calorie surplus
      protein = Math.round(weight * 2.0); // 2g per kg bodyweight (research-backed for muscle gain)
      break;
    case 'weight_loss':
      calories = Math.round(tdee - 500); // Calorie deficit (0.5kg/week loss)
      protein = Math.round(weight * 1.8); // Higher protein for satiety & muscle preservation
      break;
    case 'maintain':
      calories = Math.round(tdee);
      protein = Math.round(weight * 1.6); // Maintenance level
      break;
    case 'general_fitness':
      calories = Math.round(tdee);
      protein = Math.round(weight * 1.5); // General health
      break;
  }

  return { calories, protein };
}

export function createUserProfile(
  age: number,
  weight: number,
  height: number,
  gender: GenderType,
  goal: GoalType
): UserProfile {
  const { calories, protein } = calculateDailyNeeds(age, weight, height, gender, goal);
  return {
    age,
    weight,
    height,
    gender,
    goal,
    dailyCalorieNeed: calories,
    dailyProteinNeed: protein,
  };
}
