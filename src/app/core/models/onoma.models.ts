export type ExerciseType =
  | 'phoneme_identification'
  | 'phoneme_manipulation'
  | 'decoding'
  | 'rapid_naming'
  | 'reading_fluency'
  | 'comprehension';

export type ActivityType = 'exercise' | 'real-world';
export type ExerciseMode = 'assessment' | 'practice' | 'real-world';

export interface AccessibilityPreferences {
  fontSize: 'comfortable' | 'large' | 'extra-large';
  lineSpacing: 'standard' | 'relaxed' | 'wide';
  textToSpeech: boolean;
  audioInstructions: boolean;
  currentLineHighlight: boolean;
  reducedClutter: boolean;
  theme: 'light' | 'dark';
}

export interface LearnerProfile {
  name: string;
  ageGroup: string;
  preferredLanguage: string;
  learningGoals: string[];
  interests: string[];
  preferences: AccessibilityPreferences;
  currentFocus: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile: LearnerProfile;
}

export interface Activity {
  id: number;
  type: ActivityType;
  skill: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: number;
  reason: string;
}

export interface ExerciseContent {
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  instruction?: string;
}

export interface Exercise {
  id: number;
  type: ExerciseType;
  skill: string;
  difficulty: number;
  content: ExerciseContent;
}

export interface ExerciseAttempt {
  exerciseId: number;
  answer: string | string[];
  correct: boolean;
  responseTime: number;
  errorType?: string;
  hintsUsed?: number;
}

export interface LearnerSkill {
  id: number;
  name: string;
  progress: number;
  change: number;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Progress {
  exercisesCompleted: number;
  currentStreak: number;
  skills: LearnerSkill[];
  achievements: Achievement[];
}
