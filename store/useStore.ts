
import { useState, useEffect, useCallback } from 'react';
import { Transaction, Category, User } from '../types';
import { 
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
} from '../services/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc
} from "firebase/firestore";

export const useStore = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          joinedAt: firebaseUser.metadata.creationTime || new Date().toISOString()
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setTransactions([]);
      return;
    }

    const q = query(collection(db, "transactions"), where("userId", "==", currentUser.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Transaction[];
      setTransactions(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    });

    return () => unsubscribe();
  }, [currentUser]);

  const login = useCallback(async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (!res.user.emailVerified) {
        return { success: false, message: 'Please verify your email first', needsVerification: true };
      }
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, pass: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await sendEmailVerification(res.user);
      return { success: true, message: 'Verification link sent to your email' };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  }, []);

  const addTransaction = useCallback(async (t: any) => {
    if (!currentUser) return;
    const { id, ...sanitizedData } = t;
    await addDoc(collection(db, "transactions"), {
      ...sanitizedData,
      userId: currentUser.id,
      createdAt: new Date().toISOString()
    });
  }, [currentUser]);

  const deleteTransaction = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "transactions", id));
  }, []);

  const updateTransaction = useCallback(async (updated: Transaction) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "transactions", id), data as any);
  }, []);

  return {
    currentUser,
    loading,
    transactions,
    login,
    signup,
    logout,
    loginWithGoogle,
    requestPasswordReset,
    addTransaction,
    deleteTransaction,
    updateTransaction
  };
};
