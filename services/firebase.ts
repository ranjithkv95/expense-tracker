
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8voMzOfUNYjDriiNrHZe9EzzHsgn53tc",
  authDomain: "budget-planner-c4791.firebaseapp.com",
  projectId: "budget-planner-c4791",
  storageBucket: "budget-planner-c4791.firebasestorage.app",
  messagingSenderId: "152223224508",
  appId: "1:152223224508:web:eefd86825cebca821ff6b9",
  measurementId: "G-JGF1N5JZWR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged
};
