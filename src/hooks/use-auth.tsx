
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'hannhu4002@gmail.com';

const protectedAdminRoutes = ['/admin'];
const protectedUserRoutes = ['/user', '/quiz'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setLoading(true);
      setUser(currentUser);
      const isAdminUser = currentUser?.email === ADMIN_EMAIL;
      setIsAdmin(isAdminUser);
      
      const isProtectedAdminRoute = protectedAdminRoutes.some(route => pathname.startsWith(route));
      const isProtectedUserRoute = protectedUserRoutes.some(route => pathname.startsWith(route));

      if (!currentUser) {
        // If not logged in, and trying to access a protected route, redirect to home
        if (isProtectedAdminRoute || isProtectedUserRoute) {
          router.push('/');
        }
      } else {
        // User is logged in
        if (isAdminUser) {
          // If admin is on a user-only route, redirect to admin dashboard
          if (isProtectedUserRoute) {
            router.push('/admin/dashboard');
          }
        } else {
          // If non-admin user is on an admin route, redirect to user dashboard
          if (isProtectedAdminRoute) {
            router.push('/user/dashboard');
          }
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const signedInUser = result.user;
      if (signedInUser?.email === ADMIN_EMAIL) {
        router.push('/admin/dashboard');
      } else {
        router.push('/user/dashboard');
      }
    } catch (error) {
      console.error("Error signing in with Google: ", error);
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const value = { user, isAdmin, loading, signInWithGoogle, signOut };
  
  const isProtectedRoute = 
    protectedAdminRoutes.some(route => pathname.startsWith(route)) ||
    protectedUserRoutes.some(route => pathname.startsWith(route));

  // While checking auth on a protected route, show a loader
  if (loading && isProtectedRoute) {
     return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
