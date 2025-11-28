import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    User
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebasedConfig';

// Sign up new user and save to database
export const signUp = async (
  email: string, 
  password: string, 
  userData?: { firstName?: string; lastName?: string; phone?: string }
): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    console.log('User account created & signed in!', user.uid);
    
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    console.log('User profile saved to database');
    return user;
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
