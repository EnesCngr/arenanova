// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDTm74TSt943xPMb9hJ5CzQonA-w5yiXLY",
  authDomain: "fest-88f5b.firebaseapp.com",
  projectId: "fest-88f5b",
  storageBucket: "fest-88f5b.firebasestorage.app",
  messagingSenderId: "460271745646",
  appId: "1:460271745646:web:7575943d9e37abbf0d047f",
  measurementId: "G-HQSBZM2CVL"
};

// Initialize Firebase (or reuse existing app to avoid duplicate-app errors)
const APP_NAME = 'mainApp';
const app = getApps().some(a => a.name === APP_NAME) ? getApp(APP_NAME) : initializeApp(firebaseConfig, APP_NAME);

// Export auth and db services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

