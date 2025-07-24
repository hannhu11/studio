
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuizzes, deleteQuiz } from '@/lib/services/quizService';
import type { Quiz } from '@/lib/types';
import { PlusCircle, FileEdit, Loader2, Trash2 } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';


export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteText, setConfirmDeleteText] = useState('');
  const { toast } = useToast();

  const fetchQuizzes = async () => {
    try {
      setIsLoading(true);
      const fetchedQuizzes = await getQuizzes();
      setQuizzes(fetchedQuizzes);
      setError(null);
    } catch (err) {
      setError('Failed to load quizzes. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDeleteQuiz = async (quizId: string) => {
    try {
        await deleteQuiz(quizId);
        toast({
            title: "Quiz Deleted",
            description: "The quiz has been successfully removed.",
        });
        // Refresh the list after deletion
        fetchQuizzes();
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Deletion Failed",
            description: "Could not delete the quiz. Please try again.",
        });
        console.error(error);
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">
          {error}
        </div>
      ) : (
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
                <Button variant="outline">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                 <AlertDialog onOpenChange={() => setConfirmDeleteText('')}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the quiz <strong className="text-foreground">{quiz.title}</strong>.
                        <br/><br/>
                        To confirm, please type <strong className="text-foreground">{quiz.title}</strong> in the box below.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Input 
                        value={confirmDeleteText}
                        onChange={(e) => setConfirmDeleteText(e.target.value)}
                        placeholder="Type the quiz title to confirm"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={confirmDeleteText !== quiz.title}
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Quiz
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
      )}
    </div>
  );
}
