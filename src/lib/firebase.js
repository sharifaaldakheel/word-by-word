// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpM2x9Azk5k7Iyyg2PWOGQgfAvSKAUI3A",
  authDomain: "word-by-word-b3bcb.firebaseapp.com",
  projectId: "word-by-word-b3bcb",
  storageBucket: "word-by-word-b3bcb.firebasestorage.app",
  messagingSenderId: "336827153217",
  appId: "1:336827153217:web:de1d7803c85457dde5bfc0",
  measurementId: "G-NSXEGKEK53"
};

// Initialize Firebase
export const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);


