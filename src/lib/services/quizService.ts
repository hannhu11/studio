import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp, deleteDoc, writeBatch, Timestamp, query, orderBy } from "firebase/firestore"; 
import type { Quiz, Question } from '@/lib/types';

// We are defining a type that represents the quiz data to be stored in Firestore.
// Note that the 'id' is not part of the data being sent to Firestore, as Firestore generates it.
type QuizData = Omit<Quiz, 'id' | 'questions'> & {
    createdAt: any; // We'll use a server-side timestamp
};

type QuestionData = Omit<Question, 'id'>;


// Function to add a new quiz to Firestore
export const addQuiz = async (quiz: Omit<Quiz, 'id'>) => {
    try {
        const quizCollection = collection(db, 'quizzes');
        const docRef = await addDoc(quizCollection, {
            title: quiz.title,
            description: quiz.description,
            createdAt: serverTimestamp()
        });

        const questionsCollection = collection(doc(db, 'quizzes', docRef.id), 'questions');
        // Use a batch write for creating all questions at once for efficiency
        const batch = writeBatch(db);
        quiz.questions.forEach(question => {
            const newQuestionRef = doc(questionsCollection); // Automatically generate a new ID
            batch.set(newQuestionRef, {
                 questionText: question.questionText,
                answers: question.answers,
                correctAnswerIndex: question.correctAnswerIndex,
                image: question.image || null,
            } as QuestionData);
        });
        await batch.commit();
        
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
        
        const quizList = await Promise.all(quizSnapshot.docs.map(async (docSnapshot) => {
            const docData = docSnapshot.data();
            const quizData = { 
                id: docSnapshot.id, 
                ...docData,
                createdAt: docData.createdAt instanceof Timestamp ? docData.createdAt.toDate() : new Date(),
            } as Quiz;
            
            // Also fetch the questions for each quiz
            const questionsCollection = collection(db, 'quizzes', docSnapshot.id, 'questions');
            const questionsSnapshot = await getDocs(questionsCollection);
            quizData.questions = questionsSnapshot.docs.map(qDoc => ({ id: qDoc.id, ...qDoc.data() } as Question));
            
            return quizData;
        }));
        
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

        const quizData = { id: quizDoc.id, ...quizDoc.data() } as Quiz;

        const questionsCollection = collection(db, 'quizzes', id, 'questions');
        const questionsSnapshot = await getDocs(questionsCollection);
        quizData.questions = questionsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Question));

        return quizData;
    } catch (e) {
        console.error("Error getting document: ", e);
        throw new Error("Could not fetch quiz from the database.");
    }
}

// Function to delete a quiz and all its sub-collection documents (questions)
export const deleteQuiz = async (id: string): Promise<void> => {
    try {
        const quizDocRef = doc(db, 'quizzes', id);
        
        // Firestore does not automatically delete sub-collections.
        // We must delete all question documents first.
        const questionsCollection = collection(quizDocRef, 'questions');
        const questionsSnapshot = await getDocs(questionsCollection);

        const batch = writeBatch(db);
        questionsSnapshot.forEach(doc => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // After deleting the sub-collection, delete the main quiz document.
        await deleteDoc(quizDocRef);
        
    } catch (e) {
        console.error("Error deleting document: ", e);
        throw new Error("Could not delete quiz from the database.");
    }
};
