// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTm74TSt943xPMb9hJ5CzQonA-w5yiXLY",
  authDomain: "fest-88f5b.firebaseapp.com",
  projectId: "fest-88f5b",
  storageBucket: "fest-88f5b.appspot.com",
  messagingSenderId: "460271745646",
  appId: "1:460271745646:web:7575943d9e37abbf0d047f",
  measurementId: "G-HQSBZM2CVL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize auth for React Native (Expo handles persistence automatically)
export const auth = getAuth(app);

// Initialize Firestore database
export const db = getFirestore(app);

// Initialize analytics (web-only; in React Native this may be noop depending on setup)
export const analytics = getAnalytics(app);