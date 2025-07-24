import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where, serverTimestamp, Timestamp, orderBy } from "firebase/firestore"; 
import type { QuizAttempt } from '@/lib/types';

// Function to add a new quiz attempt to Firestore
export const addQuizAttempt = async (attempt: Omit<QuizAttempt, 'id' | 'submittedAt'>): Promise<string> => {
    try {
        const attemptCollection = collection(db, 'attempts');
        const docRef = await addDoc(attemptCollection, {
            ...attempt,
            submittedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (e) {
        console.error("Error adding quiz attempt: ", e);
        throw new Error("Could not save quiz attempt.");
    }
};

// Function to get all attempts for a specific user, using cache for speed.
export const getAttemptsByUserId = async (userId: string): Promise<QuizAttempt[]> => {
    try {
        const attemptCollection = collection(db, 'attempts');
        const q = query(attemptCollection, where("userId", "==", userId), orderBy("submittedAt", "desc"));
        const attemptSnapshot = await getDocs(q);

        const attemptList = attemptSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(),
            } as QuizAttempt;
        });
        
        return attemptList;

    } catch (e) {
        console.error("Error getting user attempts: ", e);
        throw new Error("Could not fetch user attempts.");
    }
};

// Function to get all attempts (for admin), using cache for speed.
export const getQuizAttempts = async (): Promise<QuizAttempt[]> => {
    try {
        const attemptCollection = collection(db, 'attempts');
        const q = query(attemptCollection, orderBy("submittedAt", "desc"));
        const attemptSnapshot = await getDocs(q);
        
        const attemptList = attemptSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                submittedAt: data.submittedAt instanceof Timestamp ? data.submittedAt.toDate() : new Date(),
            } as QuizAttempt;
        });

        return attemptList;
    } catch(e) {
        console.error("Error getting all attempts:", e);
        throw new Error("Could not fetch quiz attempts.");
    }
}
