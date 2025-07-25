
'use server';

import { revalidatePath } from 'next/cache';
import { addQuiz, deleteQuiz } from '@/lib/services/quizService';
import type { Quiz } from '@/lib/types';
import { redirect } from 'next/navigation';

export async function createQuizAction(quiz: Omit<Quiz, 'id' | 'createdAt'>) {
    try {
        await addQuiz(quiz);
        // Revalidate all paths that display quiz lists
        revalidatePath('/admin/quizzes');
        revalidatePath('/admin/dashboard');
        revalidatePath('/user/dashboard');
        return { success: true };
    } catch (error) {
        console.error("Creation Failed", error);
        return { success: false, error: 'Could not add quiz to the database.' };
    }
}


export async function deleteQuizAction(quizId: string) {
  try {
    await deleteQuiz(quizId);
    // Revalidate all paths that display quiz lists
    revalidatePath('/admin/quizzes');
    revalidatePath('/admin/dashboard');
    revalidatePath('/user/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Deletion Failed", error);
    return { success: false, error: 'Could not delete the quiz. Please try again.' };
  }
}
