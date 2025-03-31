import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAtY3yUr8zYtsIV6KQJfP1Q1cgZ6wND290",
  authDomain: "meshup-a3804.firebaseapp.com",
  projectId: "meshup-a3804",
  storageBucket: "meshup-a3804.firebasestorage.app",
  messagingSenderId: "353023478672",
  appId: "1:353023478672:web:f5b9481053eb804d55c115"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
