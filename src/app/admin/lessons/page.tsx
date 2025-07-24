'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, BookOpen, FileUp, Trash2, Wand2 } from 'lucide-react';
import type { LessonSummary } from '@/lib/types';
import { summarizeLesson } from '@/ai/flows/summarize-lesson';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getLessons, addLesson, deleteLesson } from '@/lib/services/lessonService';
import { useToast } from '@/hooks/use-toast';

export default function AdminLessonsPage() {
    const [lessons, setLessons] = useState<LessonSummary[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchLessons = async () => {
        try {
            setIsLoading(true);
            const fetchedLessons = await getLessons();
            setLessons(fetchedLessons);
        } catch (err) {
            setError("Failed to load lessons.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

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

        setIsSummarizing(true);
        setError(null);

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = async (e) => {
            const lessonContent = e.target?.result as string;
            if (!lessonContent) {
                setError("Could not read file content.");
                setIsSummarizing(false);
                return;
            }

            try {
                const result = await summarizeLesson({ lessonContent });
                const newLesson: Omit<LessonSummary, 'id'> = {
                    title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension for title
                    summary: result.summary,
                    originalFileName: file.name,
                };
                await addLesson(newLesson);
                toast({
                    title: "Lesson Added",
                    description: `"${newLesson.title}" has been summarized and saved.`,
                });
                setFile(null);
                fetchLessons(); // Refresh the list
            } catch (err) {
                setError("Failed to summarize the lesson. Please try again.");
                console.error(err);
            } finally {
                setIsSummarizing(false);
            }
        };
        reader.onerror = () => {
             setError("Error reading the file.");
             setIsSummarizing(false);
        }
    };
    
    const handleDelete = async (lessonId: string, lessonTitle: string) => {
        try {
            await deleteLesson(lessonId);
            toast({
                title: "Lesson Deleted",
                description: `"${lessonTitle}" has been removed.`,
            });
            fetchLessons(); // Refresh list
        } catch (err) {
            toast({
                variant: 'destructive',
                title: "Deletion Failed",
                description: "Could not delete the lesson. Please try again."
            })
        }
    }


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
                            <Button onClick={handleSummarize} disabled={!file || isSummarizing} className="w-full">
                                {isSummarizing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                                {isSummarizing ? 'Summarizing...' : 'Summarize & Add'}
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
                            {isLoading ? (
                                <div className="flex justify-center items-center py-8">
                                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                </div>
                            ) : lessons.length === 0 ? (
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
                                             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(lesson.id, lesson.title)}>
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
