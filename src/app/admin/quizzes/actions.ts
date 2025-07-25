
'use server';

import { revalidatePath } from 'next/cache';
import { addQuiz } from '@/lib/services/quizService';
import type { Quiz } from '@/lib/types';
import { redirect } from 'next/navigation';

export async function createQuizAction(quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<void> {
    try {
        await addQuiz(quiz);
    } catch (error) {
        console.error("Creation Failed", error);
        // We will let the client handle the error state, but not redirect.
        // In a real app, you might want to return an error object.
        return;
    }
    
    revalidatePath('/admin/quizzes');
    redirect('/admin/quizzes');
}


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
