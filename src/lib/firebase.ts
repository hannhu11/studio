// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "ai-quiz-master-6t9kh",
  appId: "1:764842868214:web:11f52f49f1631d93c69bd7",
  storageBucket: "ai-quiz-master-6t9kh.firebasestorage.app",
  apiKey: "AIzaSyCWNvi18ZER4SMj_Py8RpXqAYgNOY3WW0M",
  authDomain: "ai-quiz-master-6t9kh.firebaseapp.com",
  messagingSenderId: "764842868214",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
