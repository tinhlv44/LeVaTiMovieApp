// Import the functions you need from the SDKs
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDllwJuI_F1ruAgWBaY44cq4oB_BWJlbqk",
  authDomain: "levatimovie.firebaseapp.com",
  projectId: "levatimovie",
  storageBucket: "levatimovie.appspot.com",
  messagingSenderId: "623211594806",
  appId: "1:623211594806:web:ed688b4c258159fccbc497"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Check if Firebase Auth has already been initialized
let auth;
try {
  auth = getAuth(app);
} catch (error) {
  // Initialize Firebase Auth with persistence if it's not already initialized
  if (error.code === 'auth/already-initialized') {
    console.log('Firebase Auth already initialized');
  } else {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
  }
}

const db = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage
const storageBucketUrl =
  "https://firebasestorage.googleapis.com/v0/b/levatimovie.appspot.com/o/";

export { auth, db, storage, storageBucketUrl };
