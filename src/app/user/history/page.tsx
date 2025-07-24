
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { getAttemptsByUserId } from '@/lib/services/attemptService';
import { getQuizzes } from '@/lib/services/quizService';
import type { Quiz, QuizAttempt } from '@/lib/types';

export default function UserHistoryPage() {
    const { user } = useAuth();
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [userAttempts, allQuizzes] = await Promise.all([
                    getAttemptsByUserId(user.uid),
                    getQuizzes()
                ]);
                setAttempts(userAttempts);
                setQuizzes(allQuizzes);
            } catch (error) {
                console.error("Failed to fetch user history:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-6">My Quiz History</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Your Past Attempts</CardTitle>
                    <CardDescription>Review your previous quiz scores and performance.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Quiz</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attempts.map(attempt => {
                                const quiz = quizzes.find(q => q.id === attempt.quizId);
                                const status = attempt.score >= 70 ? 'Pass' : 'Fail';
                                return (
                                    <TableRow key={attempt.id}>
                                        <TableCell className="font-medium">{quiz?.title ?? 'Unknown Quiz'}</TableCell>
                                        <TableCell>{attempt.score}%</TableCell>
                                        <TableCell>
                                            <Badge variant={status === 'Pass' ? 'default' : 'destructive'}>
                                                {status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{attempt.submittedAt.toLocaleDateString()}</TableCell>
                                        <TableCell className="text-right">
                                            {/* Note: The review button currently just restarts the quiz. A dedicated review page would be a future improvement. */}
                                            <Link href={`/quiz/${attempt.quizId}`} passHref>
                                                <Button variant="outline" size="sm">
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Review
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
