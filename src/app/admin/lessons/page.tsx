'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, BookOpen, FileUp, Trash2, Wand2 } from 'lucide-react';
import { mockLessons } from '@/lib/mock-data';
import type { LessonSummary } from '@/lib/types';
import { summarizeLesson } from '@/ai/flows/summarize-lesson';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminLessonsPage() {
    const [lessons, setLessons] = useState<LessonSummary[]>(mockLessons);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleSummarize = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (e) => {
            const lessonContent = e.target?.result as string;
            if (!lessonContent) {
                setError("Could not read file content.");
                setIsLoading(false);
                return;
            }

            try {
                const result = await summarizeLesson({ lessonContent });
                const newLesson: LessonSummary = {
                    id: `lesson-${Date.now()}`,
                    title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for title
                    summary: result.summary,
                    originalFileName: file.name,
                };
                setLessons(prev => [newLesson, ...prev]);
                setFile(null); 
            } catch (err) {
                setError("Failed to summarize the lesson. Please try again.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        reader.onerror = () => {
             setError("Error reading the file.");
             setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-6">Manage Lessons</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Lesson Content</CardTitle>
                            <CardDescription>Upload a text file (.txt, .md) and AI will summarize it for students.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="lesson-file">Lesson File</Label>
                                <Input id="lesson-file" type="file" onChange={handleFileChange} accept=".txt,.md,text/plain" />
                                {file && <p className="text-sm text-muted-foreground mt-2">Selected: {file.name}</p>}
                            </div>
                            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                            <Button onClick={handleSummarize} disabled={!file || isLoading} className="w-full">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                {isLoading ? 'Summarizing...' : 'Summarize & Add'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Available Lesson Summaries</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {lessons.length === 0 ? (
                                <p className="text-muted-foreground text-center py-8">No lessons summarized yet.</p>
                            ) : (
                                lessons.map(lesson => (
                                    <Card key={lesson.id} className="bg-background">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                                            <CardDescription>Original file: {lesson.originalFileName}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground line-clamp-3">{lesson.summary}</p>
                                        </CardContent>
                                        <CardFooter className="flex justify-end">
                                             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
