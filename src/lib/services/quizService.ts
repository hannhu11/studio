
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, deleteDoc, Timestamp, query, orderBy, serverTimestamp } from "firebase/firestore"; 
import type { Quiz, Question } from '@/lib/types';


// Function to add a new quiz to Firestore
export const addQuiz = async (quiz: Omit<Quiz, 'id' | 'createdAt'>): Promise<string> => {
    try {
        const quizCollection = collection(db, 'quizzes');
        
        // The server timestamp is added here to ensure data integrity.
        // Question IDs are no longer manually created to prevent type inconsistencies.
        const quizDataWithServerInfo = {
            ...quiz,
            createdAt: serverTimestamp(),
            questions: quiz.questions.map(q => {
                // Create a new object without the 'id' property if it exists
                const { id, ...questionData } = q;
                return questionData;
            }),
        };

        const docRef = await addDoc(quizCollection, quizDataWithServerInfo);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not add quiz to the database.");
    }
}

// Function to get all quizzes from Firestore, utilizing the cache for speed.
export const getQuizzes = async (): Promise<Quiz[]> => {
    try {
        const quizCollection = collection(db, 'quizzes');
        const q = query(quizCollection, orderBy("createdAt", "desc"));
        const quizSnapshot = await getDocs(q);
        
        const quizList = quizSnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            return {
                id: docSnapshot.id,
                title: data.title,
                description: data.description,
                questions: data.questions || [],
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
            } as Quiz;
        });
        
        return quizList;
    } catch (e) {
        console.error("Error getting documents: ", e);
        throw new Error("Could not fetch quizzes from the database.");
    }
};

// Function to get a single quiz with all its questions
export const getQuizById = async (id: string): Promise<Quiz | null> => {
     try {
        const quizDocRef = doc(db, 'quizzes', id);
        const quizDoc = await getDoc(quizDocRef);

        if (!quizDoc.exists()) {
            console.log('No such document!');
            return null;
        }

        const data = quizDoc.data();
        const quizData = {
            id: quizDoc.id,
            title: data.title,
            description: data.description,
            // Assign a temporary ID for client-side key purposes if needed
            questions: (data.questions || []).map((q: Omit<Question, 'id'>, index: number) => ({...q, id: `${quizDoc.id}-${index}`})),
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as Quiz;

        return quizData;
    } catch (e) {
        console.error("Error getting document: ", e);
        throw new Error("Could not fetch quiz from the database.");
    }
}

// Function to delete a quiz.
export const deleteQuiz = async (id: string): Promise<void> => {
    try {
        const quizDocRef = doc(db, 'quizzes', id);
        await deleteDoc(quizDocRef);
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete quiz from the database.");
    }
};
