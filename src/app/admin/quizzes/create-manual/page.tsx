
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, PlusCircle, Trash2, Save, X } from 'lucide-react';
import type { Quiz, Question } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { createQuizAction } from '../actions';

type ManualQuestion = Omit<Question, 'id'>;
type ManualQuiz = Omit<Quiz, 'id' | 'createdAt'>;

export default function CreateManualQuizPage() {
  const [quiz, setQuiz] = useState<ManualQuiz>({
    title: '',
    description: '',
    questions: [],
  });
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleQuizMetaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setQuiz({ ...quiz, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = () => {
    const newQuestion: ManualQuestion = {
      questionText: '',
      answers: ['', ''],
      correctAnswerIndex: 0,
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const handleQuestionChange = (qIndex: number, value: string) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].questionText = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleAnswerChange = (qIndex: number, aIndex: number, value: string) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].answers[aIndex] = value;
    setQuiz({ ...quiz, questions: newQuestions });
  };
  
  const handleCorrectAnswerChange = (qIndex: number, aIndex: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].correctAnswerIndex = aIndex;
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleAddAnswer = (qIndex: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions[qIndex].answers.push('');
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleRemoveAnswer = (qIndex: number, aIndex: number) => {
    const newQuestions = [...quiz.questions];
    // Prevent removing if only two answers are left
    if(newQuestions[qIndex].answers.length <= 2) {
        toast({ variant: 'destructive', title: "Cannot remove answer", description: "A question must have at least two answers." });
        return;
    }
    // If the removed answer was the correct one, reset the correct index to 0
    if (newQuestions[qIndex].correctAnswerIndex === aIndex) {
        newQuestions[qIndex].correctAnswerIndex = 0;
    }
    newQuestions[qIndex].answers.splice(aIndex, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handleRemoveQuestion = (qIndex: number) => {
    const newQuestions = [...quiz.questions];
    newQuestions.splice(qIndex, 1);
    setQuiz({ ...quiz, questions: newQuestions });
  };

  const handlePublishQuiz = async () => {
    if (!quiz.title || quiz.questions.length === 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide a title and at least one question.",
      });
      return;
    }
    for (const q of quiz.questions) {
        if (!q.questionText || q.answers.some(a => !a)) {
            toast({ variant: 'destructive', title: 'Validation Error', description: 'Please fill out all question and answer fields.' });
            return;
        }
    }
    
    setIsPublishing(true);
    try {
        const result = await createQuizAction(quiz);
        if (result.success) {
            toast({
                title: "Quiz Published!",
                description: `"${quiz.title}" is now available for users.`,
            });
            router.push('/admin/quizzes');
        } else {
            toast({
                variant: "destructive",
                title: "Publishing Failed",
                description: result.error,
            });
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "An Unexpected Error Occurred",
            description: "Something went wrong. Please try again.",
        });
    } finally {
        setIsPublishing(false);
    }
  };

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-2">Create Quiz Manually</h1>
      <p className="text-muted-foreground mb-6">Build your quiz question by question.</p>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Quiz Title</Label>
              <Input id="title" name="title" value={quiz.title} onChange={handleQuizMetaChange} placeholder="e.g. Biology Midterm Review" disabled={isPublishing} />
            </div>
            <div>
              <Label htmlFor="description">Quiz Description</Label>
              <Textarea id="description" name="description" value={quiz.description} onChange={handleQuizMetaChange} placeholder="A short description of what this quiz is about." disabled={isPublishing} />
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add and edit the questions for your quiz.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {quiz.questions.map((q, qIndex) => (
                    <Card key={qIndex} className="bg-secondary/50 p-4">
                        <div className="flex justify-between items-start mb-4">
                            <Label className="text-lg font-semibold">Question {qIndex + 1}</Label>
                            <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleRemoveQuestion(qIndex)} disabled={isPublishing}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <Textarea 
                                placeholder="Enter your question here..."
                                value={q.questionText}
                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                disabled={isPublishing}
                            />
                            <RadioGroup value={q.correctAnswerIndex.toString()} onValueChange={(val) => handleCorrectAnswerChange(qIndex, parseInt(val))}>
                                <Label className="text-base">Answers</Label>
                                <p className="text-sm text-muted-foreground -mt-2">Select the correct answer by clicking the radio button.</p>
                                {q.answers.map((ans, aIndex) => (
                                    <div key={aIndex} className="flex items-center gap-2">
                                        <RadioGroupItem value={aIndex.toString()} id={`q${qIndex}a${aIndex}`} />
                                        <Input
                                            placeholder={`Answer ${aIndex + 1}`}
                                            value={ans}
                                            onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                            disabled={isPublishing}
                                        />
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveAnswer(qIndex, aIndex)} disabled={isPublishing}>
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </RadioGroup>
                            <Button variant="outline" size="sm" onClick={() => handleAddAnswer(qIndex)} disabled={isPublishing}>
                                <PlusCircle className="mr-2 h-4 w-4"/> Add Answer
                            </Button>
                        </div>
                    </Card>
                ))}
                <Button onClick={handleAddQuestion} disabled={isPublishing} className="w-full border-dashed" variant="outline">
                    <PlusCircle className="mr-2 h-4 w-4"/> Add Question
                </Button>
            </CardContent>
        </Card>
        
        <div className="flex justify-end">
            <Button size="lg" onClick={handlePublishQuiz} disabled={isPublishing}>
                {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {isPublishing ? 'Publishing...' : 'Save & Publish Quiz'}
            </Button>
        </div>
      </div>
    </div>
  );
}

