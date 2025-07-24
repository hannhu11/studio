export interface Question {
  id: string;
  questionText: string;
  image?: string; // URL to the image
  answers: string[];
  correctAnswerIndex: number;
}

export interface Quiz {
  id:string;
  title: string;
  description: string;
  questions: Question[];
  createdAt?: any;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  userName: string;
  score: number; // as a percentage
  timeTaken: number; // in seconds
  submittedAt: any;
  answers: { questionId: string; selectedAnswerIndex: number | null }[];
}

export interface LessonSummary {
  id: string;
  title: string;
  summary: string;
  originalFileName: string;
  createdAt?: any; // To be able to sort by date
}
