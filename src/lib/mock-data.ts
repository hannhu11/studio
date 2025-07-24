import type { Quiz, QuizAttempt, LessonSummary, User } from './types';

// Mock Users
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://placehold.co/100x100.png' },
];

// Mock Quiz Attempts (To be replaced with Firestore)
export const mockAttempts: QuizAttempt[] = [
  {
    id: 'attempt-1',
    quizId: 'quiz-1',
    userId: 'user-1',
    userName: 'Alice',
    score: 67,
    timeTaken: 180, // 3 minutes
    submittedAt: new Date('2023-10-26T10:00:00Z'),
    answers: [
      { questionId: 'q-1-1', selectedAnswerIndex: 1 },
      { questionId: 'q-1-2', selectedAnswerIndex: 1 },
      { questionId: 'q-1-3', selectedAnswerIndex: 0 }, // Wrong answer
    ],
  },
  {
    id: 'attempt-2',
    quizId: 'quiz-2',
    userId: 'user-2',
    userName: 'Bob',
    score: 100,
    timeTaken: 125, // 2 minutes 5 seconds
    submittedAt: new Date('2023-10-27T11:30:00Z'),
    answers: [
      { questionId: 'q-2-1', selectedAnswerIndex: 1 },
      { questionId: 'q-2-2', selectedAnswerIndex: 2 },
    ],
  },
    {
    id: 'attempt-3',
    quizId: 'quiz-1',
    userId: 'user-2',
    userName: 'Bob',
    score: 100,
    timeTaken: 90,
    submittedAt: new Date('2023-10-28T14:00:00Z'),
    answers: [
      { questionId: 'q-1-1', selectedAnswerIndex: 1 },
      { questionId: 'q-1-2', selectedAnswerIndex: 1 },
      { questionId: 'q-1-3', selectedAnswerIndex: 2 },
    ],
  },
];

// Mock Lesson Summaries (DEPRECATED - Data is now fetched from Firestore)
export const mockLessons: LessonSummary[] = [];
