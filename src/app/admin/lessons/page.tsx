
import { getLessons } from '@/lib/services/lessonService';
import { LessonList } from './_components/lesson-list';

export default async function AdminLessonsPage() {
    const lessons = await getLessons();

    return (
        <div>
            <h1 className="font-headline text-3xl font-bold mb-6">Manage Lessons</h1>
            <LessonList initialLessons={lessons} />
        </div>
    );
}
