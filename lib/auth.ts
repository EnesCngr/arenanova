import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth';
import { auth } from '../firebaseAuthConfig';

// Sign up new user
export const signUp = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User account created & signed in!', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    // Handle specific Firebase Auth error codes
    let errorMessage = 'An error occurred during signup';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email address is already in use';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak. Use at least 6 characters';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Check your connection';
        break;
      default:
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Sign in existing user
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('User signed in!', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    // Handle specific Firebase Auth error codes
    let errorMessage = 'An error occurred during login';
    
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address format';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid email or password';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Check your connection';
        break;
      default:
        errorMessage = error.message;
    }
    
    throw new Error(errorMessage);
  }
};

// Sign out user
export const logOut = async (): Promise<void> => {
  try {
    await signOut(auth);
    console.log('User signed out successfully');
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};
