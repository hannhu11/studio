import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockQuizzes } from '@/lib/mock-data';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserDashboard() {
  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-2">Available Quizzes</h1>
      <p className="text-muted-foreground mb-6">Choose a quiz to test your knowledge.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockQuizzes.map(quiz => (
          <Card key={quiz.id} className="flex flex-col overflow-hidden">
            <CardHeader className="p-0">
              <div className="aspect-video relative w-full">
                  <Image 
                      src={quiz.questions.find(q => q.image)?.image || `https://placehold.co/600x400.png`}
                      alt={quiz.title}
                      fill
                      className="object-cover"
                      data-ai-hint="education learning"
                  />
              </div>
            </CardHeader>
            <div className="p-6 flex flex-col flex-grow">
              <CardTitle className="mb-2">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
              <CardContent className="p-0 pt-4 flex-grow">
                <p className="text-sm text-muted-foreground">{quiz.questions.length} questions</p>
              </CardContent>
              <CardFooter className="p-0 pt-6">
                <Link href={`/quiz/${quiz.id}`} passHref className="w-full">
                  <Button className="w-full">
                    Start Quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
