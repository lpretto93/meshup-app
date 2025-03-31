// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtY3yUr8zYtsIV6KQJfP1Q1cgZ6wND290",
  authDomain: "meshup-a3804.firebaseapp.com",
  projectId: "meshup-a3804",
  storageBucket: "meshup-a3804.appspot.com",
  messagingSenderId: "353023478672",
  appId: "1:353023478672:web:f5b9481053eb804d55c115"
};

// 🚀 Inizializza l'app
const app = initializeApp(firebaseConfig);

// ✅ Inizializza servizi
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// (opzionale) provider per social login
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");

// ✅ Esporta tutti i servizi
export { auth, db, storage, googleProvider, appleProvider };
