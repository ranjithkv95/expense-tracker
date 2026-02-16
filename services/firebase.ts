
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
  apiKey: "AIzaSyBX5L0DV_O-Db0-sUPvw80I-i1rtfRX4NA",
  authDomain: "budget-planner-c4791.firebaseapp.com",
  projectId: "budget-planner-c4791",
  storageBucket: "budget-planner-c4791.firebasestorage.app",
  messagingSenderId: "152223224508",
  appId: "1:152223224508:web:5c75fa5eb2b2f3401ff6b9",
  measurementId: "G-LZQMYLK0J1"
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
