
import { getQuizzes } from '@/lib/services/quizService';
import { getQuizAttempts }from '@/lib/services/attemptService';
import { AdminDashboardClient } from './_components/admin-dashboard-client';


export default async function AdminDashboard() {
  const [quizzes, attempts] = await Promise.all([
    getQuizzes(),
    getQuizAttempts(),
  ]);

  return <AdminDashboardClient initialQuizzes={quizzes} initialAttempts={attempts} />;
}
