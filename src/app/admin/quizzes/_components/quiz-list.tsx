
'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Quiz } from '@/lib/types';
import { PlusCircle, FileEdit, Trash2, Loader2, Wand2, PenSquare } from 'lucide-react';
import Link from 'next/link';
import { deleteQuizAction } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function QuizList({ initialQuizzes }: { initialQuizzes: Quiz[] }) {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const handleDeleteQuiz = async (quizId: string) => {
    startTransition(async () => {
      const result = await deleteQuizAction(quizId);
      if (result.success) {
        setQuizzes(quizzes.filter(q => q.id !== quizId));
        toast({
          title: "Quiz Deleted",
          description: "The quiz has been successfully removed.",
        });
        // router.refresh() is not strictly needed due to revalidatePath in the action,
        // but it can help ensure the current page reflects the change immediately.
        router.refresh(); 
      } else {
        toast({
          variant: 'destructive',
          title: "Deletion Failed",
          description: result.error,
        });
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline text-3xl font-bold">Manage Quizzes</h1>
        <div className="flex gap-2">
          <Link href="/admin/quizzes/create-manual" passHref>
            <Button variant="outline">
              <PenSquare className="mr-2 h-4 w-4" />
              Create Manually
            </Button>
          </Link>
          <Link href="/admin/quizzes/create" passHref>
            <Button>
              <Wand2 className="mr-2 h-4 w-4" />
              Create with AI
            </Button>
          </Link>
        </div>
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
              <Button variant="destructive" className="w-full" onClick={() => handleDeleteQuiz(quiz.id)} disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
        {quizzes.length === 0 && !isPending && (
             <Card className="md:col-span-2 lg:col-span-3 border-dashed flex flex-col items-center justify-center text-center py-12">
                <CardHeader>
                    <CardTitle>No Quizzes Found</CardTitle>
                    <CardDescription>Get started by creating a new quiz.</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-4">
                    <Link href="/admin/quizzes/create-manual" passHref>
                      <Button variant="outline">
                        <PenSquare className="mr-2 h-4 w-4" />
                        Create Manually
                      </Button>
                    </Link>
                    <Link href="/admin/quizzes/create" passHref>
                        <Button>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Create with AI
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
