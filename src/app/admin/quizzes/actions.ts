
'use server';

import { revalidatePath } from 'next/cache';
import { deleteQuiz } from '@/lib/services/quizService';

export async function deleteQuizAction(quizId: string) {
  try {
    await deleteQuiz(quizId);
    revalidatePath('/admin/quizzes');
    return { success: true };
  } catch (error) {
    console.error("Deletion Failed", error);
    return { success: false, error: 'Could not delete the quiz. Please try again.' };
  }
}
