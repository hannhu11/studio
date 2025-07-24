import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockQuizzes } from '@/lib/mock-data';
import { PlusCircle, FileEdit } from 'lucide-react';
import Link from 'next/link';

export default function AdminQuizzesPage() {
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
        {mockQuizzes.map(quiz => (
          <Card key={quiz.id}>
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
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
    </div>
  );
}
