import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardCheck, Book, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
// Note: This page still uses mock data. This should be updated to use real data from Firestore.
import { mockQuizzes, mockAttempts, mockUsers } from '@/lib/mock-data';

const totalAttempts = mockAttempts.length;
const totalUsers = mockUsers.length;
const totalQuizzes = mockQuizzes.length;
const avgScore = totalAttempts > 0 ? Math.round(mockAttempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts) : 0;


export default function AdminDashboard() {
  const recentAttempts = [...mockAttempts].sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime()).slice(0, 5);

  return (
    <div>
      <h1 className="font-headline text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuizzes}</div>
            <p className="text-xs text-muted-foreground">Published quizzes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Attempts</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAttempts}</div>
            <p className="text-xs text-muted-foreground">Completed by users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}%</div>
            <p className="text-xs text-muted-foreground">Across all attempts</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Quiz Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">User</TableHead>
                <TableHead>Quiz</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentAttempts.map(attempt => (
                <TableRow key={attempt.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={mockUsers.find(u => u.id === attempt.userId)?.avatarUrl} />
                        <AvatarFallback>{attempt.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{attempt.userName}</span>
                    </div>
                  </TableCell>
                  <TableCell>{mockQuizzes.find(q => q.id === attempt.quizId)?.title}</TableCell>
                  <TableCell>
                    <Badge variant={attempt.score > 70 ? "default" : "destructive"}>{attempt.score}%</Badge>
                  </TableCell>
                  <TableCell>{attempt.submittedAt.toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
