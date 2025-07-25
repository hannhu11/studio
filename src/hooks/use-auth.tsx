'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import create from 'zustand';

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  _setUser: (user: User | null) => void;
  _setLoading: (loading: boolean) => void;
}

// IMPORTANT: Replace this with your actual admin email address.
const ADMIN_EMAIL = 'hannhu4002@gmail.com'; 

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  isAdmin: false,
  loading: true,
  signInWithGoogle: async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  },
  signOut: async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  },
  _setUser: (user: User | null) => {
    set({ user, isAdmin: !!user && user.email === ADMIN_EMAIL });
  },
  _setLoading: (loading: boolean) => {
    set({ loading });
  },
}));

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { _setUser, _setLoading } = useAuth.getState();
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      _setUser(currentUser);
      _setLoading(false);
    });
    return () => unsubscribe();
  }, [_setUser, _setLoading]);

  return <>{children}</>;
};
