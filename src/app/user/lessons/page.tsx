
import { getLessons } from '@/lib/services/lessonService';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { LessonSummary } from "@/lib/types";
import { BookOpen } from "lucide-react"

export default async function UserLessonsPage() {
    const lessons = await getLessons();

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
                 {lessons.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
                        <p>No lesson summaries are available yet. Check back later!</p>
                    </div>
                )}
            </Accordion>
        </div>
    )
}
