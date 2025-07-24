import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockAttempts, mockQuizzes } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';

function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
}

export default function UserHistoryPage() {
    const userAttempts = [...mockAttempts].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime());

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
                            {userAttempts.map(attempt => {
                                const quiz = mockQuizzes.find(q => q.id === attempt.quizId);
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
