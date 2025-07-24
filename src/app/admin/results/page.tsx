
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getQuizAttempts } from '@/lib/services/attemptService';
import { getQuizzes } from '@/lib/services/quizService';
import type { Quiz, QuizAttempt } from '@/lib/types';

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

export default async function AdminResultsPage() {
    const [attempts, quizzes] = await Promise.all([
        getQuizAttempts(),
        getQuizzes()
    ]);

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
                             {attempts.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        No results yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
