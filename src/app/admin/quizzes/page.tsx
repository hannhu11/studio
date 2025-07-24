
import { getQuizzes } from '@/lib/services/quizService';
import { QuizList } from './_components/quiz-list';

// This is a server component that fetches data
export default async function AdminQuizzesPage() {
  const quizzes = await getQuizzes();

  // It then passes the data to a Client Component
  return <QuizList initialQuizzes={quizzes} />;
}
