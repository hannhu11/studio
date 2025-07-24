import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import type { LessonSummary } from '@/lib/types';

// Function to add a new lesson to Firestore
export const addLesson = async (lesson: Omit<LessonSummary, 'id'>): Promise<string> => {
    try {
        const lessonCollection = collection(db, 'lessons');
        const docRef = await addDoc(lessonCollection, {
            ...lesson,
            createdAt: serverTimestamp()
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding lesson: ", e);
        throw new Error("Could not add lesson to the database.");
    }
};

// Function to get all lessons from Firestore
export const getLessons = async (): Promise<LessonSummary[]> => {
    try {
        const lessonCollection = collection(db, 'lessons');
        const lessonSnapshot = await getDocs(lessonCollection);
        
        const lessonList = lessonSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            } as LessonSummary;
        });

        // Sort by creation date, newest first
        // @ts-ignore
        lessonList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return lessonList;
    } catch (e) {
        console.error("Error getting lessons: ", e);
        throw new Error("Could not fetch lessons from the database.");
    }
};

// Function to delete a lesson from Firestore
export const deleteLesson = async (id: string): Promise<void> => {
    try {
        const lessonDocRef = doc(db, 'lessons', id);
        await deleteDoc(lessonDocRef);
    } catch (e) {
        console.error("Error deleting lesson: ", e);
        throw new Error("Could not delete lesson from the database.");
    }
};