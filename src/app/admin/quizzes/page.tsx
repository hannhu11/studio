
import { getQuizzes } from '@/lib/services/quizService';
import { QuizList } from './_components/quiz-list';

export default async function AdminQuizzesPage() {
  const quizzes = await getQuizzes();

  return (
    <div>
      <QuizList initialQuizzes={quizzes} />
    </div>
  );
}
