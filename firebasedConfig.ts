// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAgK-tUwoNmGq0fGDmhnl6pvhcJZ_pyiBE",
  authDomain: "festivalapp-6d999.firebaseapp.com",
  projectId: "festivalapp-6d999",
  storageBucket: "festivalapp-6d999.firebasestorage.app",
  messagingSenderId: "690109464502",
  appId: "1:690109464502:web:b74bc014018229654d4b17",
  measurementId: "G-HBNVCFKV4K"
};

// Initialize Firebase (or reuse existing app to avoid duplicate-app errors)
const APP_NAME = 'mainApp';
const app = getApps().some(a => a.name === APP_NAME) ? getApp(APP_NAME) : initializeApp(firebaseConfig, APP_NAME);

// Export auth and db services
export const auth = getAuth(app);
export const db = getFirestore(app);
export { app };

