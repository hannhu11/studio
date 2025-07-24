import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore"; 
import type { Quiz } from '@/lib/types';


// Function to add a new quiz to Firestore
export const addQuiz = async (quiz: Omit<Quiz, 'id'>): Promise<string> => {
    try {
        const quizCollection = collection(db, 'quizzes');
        // Now, we store the questions array directly in the quiz document.
        // The question IDs are generated client-side for simplicity or can be omitted if not strictly needed for sub-document identification.
        const quizDataWithTimestamp = {
            ...quiz,
            questions: quiz.questions.map((q, index) => ({
                // ensure questions have a temporary id, though firestore will store them in an array
                id: q.id || `${Date.now()}-${index}`, 
                ...q
            })),
            createdAt: serverTimestamp()
        };

        const docRef = await addDoc(quizCollection, quizDataWithTimestamp);
        return docRef.id;
    } catch (e) {
        console.error("Error adding document: ", e);
        throw new Error("Could not add quiz to the database.");
    }
}

// Function to get all quizzes from Firestore
export const getQuizzes = async (): Promise<Quiz[]> => {
    try {
        const quizCollection = collection(db, 'quizzes');
        const q = query(quizCollection, orderBy("createdAt", "desc"));
        const quizSnapshot = await getDocs(q);
        
        // With questions embedded, we no longer need to make N+1 queries.
        const quizList = quizSnapshot.docs.map(docSnapshot => {
            const data = docSnapshot.data();
            return {
                id: docSnapshot.id,
                title: data.title,
                description: data.description,
                questions: data.questions || [], // Questions are now part of the document
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
        // The entire quiz, including questions, is fetched in one go.
        const quizData = {
            id: quizDoc.id,
            title: data.title,
            description: data.description,
            questions: data.questions || [],
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(),
        } as Quiz;

        return quizData;
    } catch (e) {
        console.error("Error getting document: ", e);
        throw new Error("Could not fetch quiz from the database.");
    }
}

// Function to delete a quiz. Since questions are embedded, we only need to delete the main document.
export const deleteQuiz = async (id: string): Promise<void> => {
    try {
        const quizDocRef = doc(db, 'quizzes', id);
        await deleteDoc(quizDocRef);
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete quiz from the database.");
    }
};
