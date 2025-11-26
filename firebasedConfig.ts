// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTm74TSt943xPMb9hJ5CzQonA-w5yiXLY",
  authDomain: "fest-88f5b.firebaseapp.com",
  projectId: "fest-88f5b",
  storageBucket: "fest-88f5b.firebasestorage.app",
  messagingSenderId: "460271745646",
  appId: "1:460271745646:web:7575943d9e37abbf0d047f",
  measurementId: "G-HQSBZM2CVL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore database
export const db = getFirestore(app);