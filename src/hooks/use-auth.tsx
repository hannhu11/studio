
'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google: ", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const isAdmin = useMemo(() => !!user && user.email === ADMIN_EMAIL, [user]);

  const value = useMemo(() => ({ user, isAdmin, loading, signInWithGoogle, signOut }), [user, isAdmin, loading]);

  return (
    <AuthContext.Provider value={value}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// This hook is for redirection logic based on auth state
export function useAuthRedirect() {
    const { user, isAdmin, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (loading) return;

        const isAuthPage = pathname === '/';
        const isAdminRoute = pathname.startsWith('/admin');
        const isUserRoute = pathname.startsWith('/user') || pathname.startsWith('/quiz');

        if (user) {
            if (isAdmin) {
                if (!isAdminRoute) {
                    router.replace('/admin/dashboard');
                }
            } else {
                if (!isUserRoute) {
                    router.replace('/user/dashboard');
                }
            }
        } else {
            if (isAdminRoute || isUserRoute) {
                router.replace('/');
            }
        }

    }, [user, isAdmin, loading, router, pathname]);

    return { loading, user, isAdmin, pathname };
}


// A component that handles the initial loading and redirection logic.
// This should wrap protected layouts.
export const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { loading, user } = useAuth();
    const { pathname } = useAuthRedirect();
    
    // While the initial user state is loading, show a global spinner.
    if (loading) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    // If not loading, and we are on a protected route without a user,
    // the useAuthRedirect hook will handle redirection.
    // We can show a loader while redirecting or just null.
    const isProtectedRoute = pathname.startsWith('/admin') || pathname.startsWith('/user') || pathname.startsWith('/quiz');
    if (isProtectedRoute && !user) {
         return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }


    return <>{children}</>;
}
