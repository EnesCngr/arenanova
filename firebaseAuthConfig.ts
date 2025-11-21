// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseAuthConfig = {
  apiKey: "AIzaSyAgK-tUwoNmGq0fGDmhnl6pvhcJZ_pyiBE",
  authDomain: "festivalapp-6d999.firebaseapp.com",
  projectId: "festivalapp-6d999",
  storageBucket: "festivalapp-6d999.firebasestorage.app",
  messagingSenderId: "690109464502",
  appId: "1:690109464502:web:b74bc014018229654d4b17",
  measurementId: "G-HBNVCFKV4K"
};

// Initialize Firebase for Authentication
export const authApp = initializeApp(firebaseAuthConfig, "authApp");
export const auth = getAuth(authApp);
