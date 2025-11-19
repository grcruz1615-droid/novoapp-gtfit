// GTFit - Tipos e Interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
}

export interface CalorieEntry {
  id: string;
  user_id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  photo_url?: string;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  created_at: string;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest_seconds: number;
  muscle_group: string;
  illustration_url?: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly';
  completed_dates: string[];
  created_at: string;
}

export interface DailyStats {
  date: string;
  calories_consumed: number;
  calories_burned: number;
  water_intake_ml: number;
  workout_completed: boolean;
  weight_kg?: number;
  photo_url?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'basic' | 'premium';
  billing_cycle: 'monthly' | 'annual';
  status: 'active' | 'cancelled' | 'expired';
  started_at: string;
  expires_at: string;
}
