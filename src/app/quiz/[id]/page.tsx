'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getQuizById } from '@/lib/services/quizService';
import type { Quiz, Question } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check, Lightbulb, Loader2, X, ZoomIn } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from 'next/image';
import { explainAnswer, ExplainAnswerOutput } from '@/ai/flows/explain-answer';
import { mockLessons } from '@/lib/mock-data'; // AI explanation context still uses this for now


function ExplanationModal({ question }: { question: Question }) {
  const [explanation, setExplanation] = useState<ExplainAnswerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For demo, we combine all lesson summaries as context. This can be improved.
  const lessonContent = mockLessons.map(l => `Title: ${l.title}\n${l.summary}`).join('\n\n---\n\n');

  const fetchExplanation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await explainAnswer({
        question: question.questionText,
        answer: question.answers[question.correctAnswerIndex],
        lessonContent: lessonContent
      });
      setExplanation(result);
    } catch (e) {
      setError("Failed to get explanation from AI.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog onOpenChange={(open) => {if(open && !explanation) fetchExplanation()}}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm"><Lightbulb className="mr-2 h-4 w-4"/> AI Explanation</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Explanation</DialogTitle>
          <DialogDescription>{question.questionText}</DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          {isLoading && <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary"/></div>}
          {error && <p className="text-destructive">{error}</p>}
          {explanation && (
            <div className="space-y-4">
              <p><span className="font-semibold">Correct Answer:</span> {question.answers[question.correctAnswerIndex]}</p>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{explanation.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
        try {
            setIsLoading(true);
            const foundQuiz = await getQuizById(quizId);
            if (foundQuiz) {
              setQuiz(foundQuiz);
              setSelectedAnswers(Array(foundQuiz.questions.length).fill(null));
            } else {
                router.push('/user/dashboard'); // Redirect if quiz not found
            }
        } catch (error) {
            console.error("Failed to fetch quiz", error);
            router.push('/user/dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    fetchQuiz();
  }, [quizId, router]);
  
  if (isLoading || !quiz) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-12 w-12 animate-spin text-primary"/></div>;
  }
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswerIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setIsFinished(true);
    // TODO: Save quiz attempt to Firestore
  };
  
  if (isFinished) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Quiz Complete!</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-6xl font-bold text-primary mb-2">{score}%</p>
                    <p className="text-muted-foreground">You have completed the {quiz.title} quiz.</p>
                    <div className="mt-6 space-y-3 max-h-[40vh] overflow-y-auto p-1">
                        {quiz.questions.map((q, index) => (
                            <div key={q.id} className="text-left p-3 rounded-md border flex items-start gap-3 bg-secondary/30">
                                {selectedAnswers[index] === q.correctAnswerIndex ? 
                                    <Check className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" /> : 
                                    <X className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />}
                                <div>
                                    <p className="font-medium">{q.questionText}</p>
                                    <p className="text-sm text-muted-foreground">Your answer: <span className={selectedAnswers[index] === q.correctAnswerIndex ? 'text-green-600 font-semibold' : 'text-destructive font-semibold'}>{q.answers[selectedAnswers[index] ?? -1] ?? 'Not answered'}</span></p>
                                    {selectedAnswers[index] !== q.correctAnswerIndex && <p className="text-sm text-green-600">Correct answer: {q.answers[q.correctAnswerIndex]}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button onClick={() => router.push('/user/dashboard')} className="mt-8 w-full">Back to Dashboard</Button>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-headline text-2xl font-bold">{quiz.title}</h1>
        <span className="text-sm text-muted-foreground whitespace-nowrap font-medium">{currentQuestionIndex + 1} / {quiz.questions.length}</span>
      </div>
      <Progress value={progress} className="w-full mb-6" />
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl leading-relaxed">{currentQuestion.questionText}</CardTitle>
          {currentQuestion.image && (
             <Dialog>
                <DialogTrigger asChild>
                    <div className="mt-4 relative h-64 w-full cursor-pointer group rounded-lg overflow-hidden">
                        <Image src={currentQuestion.image} alt="Question visual aid" fill className="object-contain" data-ai-hint="planet mars" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <ZoomIn className="h-10 w-10 text-white" />
                        </div>
                    </div>
                 </DialogTrigger>
                 <DialogContent className="max-w-4xl h-[90vh] p-4 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      <Image src={currentQuestion.image} alt="Question visual aid" fill className="object-contain" data-ai-hint="planet mars" />
                    </div>
                 </DialogContent>
             </Dialog>
          )}
        </CardHeader>
        <CardContent>
          <RadioGroup 
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            value={selectedAnswers[currentQuestionIndex]?.toString()}
            className="space-y-3"
          >
            {currentQuestion.answers.map((answer, index) => (
              <Label key={index} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-secondary has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:text-accent-foreground has-[[data-state=checked]]:border-accent-foreground/50 transition-all text-base">
                <RadioGroupItem value={index.toString()} id={`answer-${index}`} className="mr-4 h-5 w-5"/>
                <span>{answer}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="flex justify-between items-center mt-6">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          <ArrowLeft className="mr-2 h-4 w-4"/>
          Previous
        </Button>
        <div className="flex-grow text-center">
            <ExplanationModal question={currentQuestion} />
        </div>
        <Button onClick={handleNext} disabled={selectedAnswers[currentQuestionIndex] === null}>
          {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          <ArrowRight className="ml-2 h-4 w-4"/>
        </Button>
      </div>
    </div>
  );
}
