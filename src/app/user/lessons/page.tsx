'use client';

import { useState, useEffect } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { LessonSummary } from "@/lib/types";
import { getLessons } from '@/lib/services/lessonService';
import { BookOpen, Loader2 } from "lucide-react"

// Revalidate this page every 60 seconds
export const revalidate = 60;

export default function UserLessonsPage() {
    const [lessons, setLessons] = useState<LessonSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setIsLoading(true);
                const fetchedLessons = await getLessons();
                setLessons(fetchedLessons);
            } catch (err) {
                setError("Could not load lessons. Please try again later.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLessons();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading lessons...</p>
            </div>
        );
    }
    
    if (error) {
        return (
          <div className="text-center text-destructive bg-destructive/10 p-4 rounded-md">
            {error}
          </div>
        );
    }

    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-2">Study Lessons</h1>
            <p className="text-muted-foreground mb-6">Review these AI-powered summaries to prepare for your quizzes.</p>
            
            <Accordion type="single" collapsible className="w-full">
                {lessons.map(lesson => (
                    <AccordionItem value={lesson.id} key={lesson.id}>
                        <AccordionTrigger className="text-lg hover:no-underline font-headline">
                            <div className="flex items-center gap-3">
                                <BookOpen className="h-5 w-5 text-accent" />
                                {lesson.title}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-4 text-base leading-relaxed text-foreground/80 prose dark:prose-invert max-w-none">
                           {lesson.summary}
                        </AccordionContent>
                    </AccordionItem>
                ))}
                 {lessons.length === 0 && !isLoading && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No lesson summaries are available yet. Check back later!</p>
                    </div>
                )}
            </Accordion>
        </div>
    )
}
