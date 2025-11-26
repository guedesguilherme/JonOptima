// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9zLCs0ynOMmYyy6QsfiqgyeU-n3fyNq8",
    authDomain: "jonoptima-a9584.firebaseapp.com",
    projectId: "jonoptima-a9584",
    storageBucket: "jonoptima-a9584.firebasestorage.app",
    messagingSenderId: "655658802382",
    appId: "1:655658802382:web:11fdd559eaf54e9d94849f",
    measurementId: "G-SGCZ7N5S7Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);