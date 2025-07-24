
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getQuizAttempts } from '@/lib/services/attemptService';
import { getQuizzes } from '@/lib/services/quizService';
import type { Quiz, QuizAttempt } from '@/lib/types';
import { Loader2 } from 'lucide-react';

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

export default function AdminResultsPage() {
    const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [fetchedAttempts, fetchedQuizzes] = await Promise.all([
                    getQuizAttempts(),
                    getQuizzes()
                ]);
                setAttempts(fetchedAttempts);
                setQuizzes(fetchedQuizzes);
            } catch (error) {
                console.error("Failed to fetch results data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-6">User Results</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Quiz Attempts</CardTitle>
                    <CardDescription>Review scores and performance for all users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Quiz</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Time Taken</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {attempts.map(attempt => {
                                const quiz = quizzes.find(q => q.id === attempt.quizId);
                                return (
                                    <TableRow key={attempt.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    {/* <AvatarImage src={user?.avatarUrl} /> */}
                                                    <AvatarFallback>{attempt.userName.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{attempt.userName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{quiz?.title ?? 'Unknown Quiz'}</TableCell>
                                        <TableCell>
                                            <Badge variant={attempt.score >= 70 ? 'default' : 'destructive'} >
                                                {attempt.score}%
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{formatTime(attempt.timeTaken)}</TableCell>
                                        <TableCell>{attempt.submittedAt.toLocaleString()}</TableCell>
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
