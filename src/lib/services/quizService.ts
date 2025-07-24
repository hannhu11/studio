import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, serverTimestamp } from "firebase/firestore"; 
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
        for (const question of quiz.questions) {
            await addDoc(questionsCollection, {
                questionText: question.questionText,
                answers: question.answers,
                correctAnswerIndex: question.correctAnswerIndex,
                image: question.image || null,
            } as QuestionData);
        }
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
        const quizSnapshot = await getDocs(quizCollection);
        const quizList = quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Quiz));
        
        // Note: For simplicity, we are not fetching all questions for the list view.
        // The 'questions' array will be empty or you might want to fetch just the count.
        return quizList.map(q => ({...q, questions: []}));
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
