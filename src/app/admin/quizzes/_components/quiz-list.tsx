
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { deleteQuiz, getQuizzes } from '@/lib/services/quizService';
import type { Quiz } from '@/lib/types';
import { PlusCircle, FileEdit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { revalidatePath } from 'next/cache';
import { toast } from '@/hooks/use-toast';

// This is now a server component
export default async function QuizList() {
  const quizzes: Quiz[] = await getQuizzes();

  async function handleDeleteQuiz(formData: FormData) {
    'use server';
    const quizId = formData.get('quizId') as string;
    const quizTitle = formData.get('quizTitle') as string;
    
    if (!quizId) return;

    try {
        await deleteQuiz(quizId);
        revalidatePath('/admin/quizzes'); // Invalidate cache for this page
        // Toast doesn't work in server actions this way, would need a more complex setup
        // For now, we rely on revalidation to show the change.
    } catch (error) {
        console.error("Deletion Failed", error);
        // Handle error state appropriately, maybe redirect with an error message
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-3xl font-bold">Manage Quizzes</h1>
        <Link href="/admin/quizzes/create" passHref>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Quiz
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {quizzes.map(quiz => (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
              <Button variant="outline" disabled>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </Button>
               <form action={handleDeleteQuiz}>
                  <input type="hidden" name="quizId" value={quiz.id} />
                  <input type="hidden" name="quizTitle" value={quiz.title} />
                  <Button variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                  </Button>
              </form>
            </CardFooter>
          </Card>
        ))}
        <Card className="border-dashed flex flex-col items-center justify-center text-center">
            <CardHeader>
                <CardTitle>Create a New Quiz</CardTitle>
                <CardDescription>Upload images and let AI do the work.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/admin/quizzes/create" passHref>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Get Started
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
