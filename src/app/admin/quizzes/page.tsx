'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { getQuizzes } from '@/lib/services/quizService';
import type { Quiz } from '@/lib/types';
import { PlusCircle, FileEdit, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
    fetchQuizzes();
  }, []);

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
            <Card key={quiz.id}>
              <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
                <CardDescription>{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* We'll need to fetch question count separately if needed */}
                <p className="text-sm text-muted-foreground">Loading questions...</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Quiz
                </Button>
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
