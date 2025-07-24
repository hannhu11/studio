import type { Quiz, QuizAttempt, LessonSummary, User } from './types';

// This file used to contain mock data for development.
// It has been replaced by live data from Firebase Firestore.
// The file is kept for reference but the data arrays are now empty.

// Mock Users (DEPRECATED - User data comes from Firebase Auth)
export const mockUsers: User[] = [];

// Mock Quiz Attempts (DEPRECATED - Data is now fetched from Firestore)
export const mockAttempts: QuizAttempt[] = [];

// Mock Lesson Summaries (DEPRECATED - Data is now fetched from Firestore)
export const mockLessons: LessonSummary[] = [];
