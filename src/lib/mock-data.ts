import type { Quiz, QuizAttempt, LessonSummary, User } from './types';

// Mock Users
export const mockUsers: User[] = [
  { id: 'user-1', name: 'Alice', avatarUrl: 'https://placehold.co/100x100.png' },
  { id: 'user-2', name: 'Bob', avatarUrl: 'https://placehold.co/100x100.png' },
];

// Mock Quizzes
export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'General Science',
    description: 'Test your knowledge of basic scientific principles.',
    questions: [
      {
        id: 'q-1-1',
        questionText: 'What is the chemical symbol for water?',
        answers: ['O2', 'H2O', 'CO2', 'NaCl'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q-1-2',
        questionText: 'Which planet is known as the Red Planet?',
        image: 'https://placehold.co/600x400.png',
        answers: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q-1-3',
        questionText: 'What is the powerhouse of the cell?',
        answers: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Chloroplast'],
        correctAnswerIndex: 2,
      },
    ],
  },
  {
    id: 'quiz-2',
    title: 'World History',
    description: 'A quiz on major historical events and figures.',
    questions: [
      {
        id: 'q-2-1',
        questionText: 'In which year did World War II end?',
        answers: ['1942', '1945', '1950', '1939'],
        correctAnswerIndex: 1,
      },
      {
        id: 'q-2-2',
        questionText: 'Who was the first President of the United States?',
        answers: ['Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams'],
        correctAnswerIndex: 2,
      },
    ],
  },
];

// Mock Quiz Attempts
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

// Mock Lesson Summaries
export const mockLessons: LessonSummary[] = [
    {
        id: 'lesson-1',
        title: 'Cell Biology Basics',
        summary: 'A cell is the smallest unit of a living thing. A living thing, whether made of one cell (like bacteria) or many cells (like a human), is called an organism. Thus, cells are the basic building blocks of all organisms. There are two main types of cells: prokaryotic and eukaryotic. The main difference between them is that eukaryotic cells have a nucleus, which contains the genetic material, while prokaryotic cells do not.',
        originalFileName: 'biology_chapter_1.txt'
    },
    {
        id: 'lesson-2',
        title: 'The American Revolution',
        summary: 'The American Revolution was a political and military struggle waged between 1765 and 1783 when 13 of Britain\'s North American colonies rejected its imperial rule. The protest began in opposition to taxes levied without colonial representation by the British monarchy and Parliament. The conflict escalated into a full-scale war, leading to the Declaration of Independence in 1776 and the eventual victory of the colonies.',
        originalFileName: 'history_unit_5.pdf'
    }
];
