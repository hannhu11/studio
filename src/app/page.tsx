
'use client';

import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/Logo';
import { useAuth, useAuthRedirect } from '@/hooks/use-auth';
import { LogIn, Loader2 } from 'lucide-react';

export default function Home() {
  const { signInWithGoogle, loading: authLoading } = useAuth();
  const { loading: redirectLoading } = useAuthRedirect();

  const isLoading = authLoading || redirectLoading;

  // This loader will be shown while the initial auth check and potential redirect happens.
  if (isLoading) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <div className="text-center mb-12">
        <div className="inline-block">
          <Logo />
        </div>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Your intelligent partner for creating and taking quizzes. AI-powered question generation for admins, and interactive learning for users.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <Button size="lg" className="w-64" onClick={signInWithGoogle} disabled={isLoading}>
            {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <LogIn className="mr-2 h-5 w-5" />
            )}
          Sign in with Google
        </Button>
      </div>
    </main>
  );
}
