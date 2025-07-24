import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Shield } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export default function Home() {
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
        <Link href="/user/dashboard" passHref>
          <Button size="lg" className="w-64">
            <User className="mr-2 h-5 w-5" />
            Enter as User
          </Button>
        </Link>
        <Link href="/admin/dashboard" passHref>
          <Button size="lg" variant="outline" className="w-64 border-primary/50 text-primary hover:bg-primary/5 hover:text-primary">
            <Shield className="mr-2 h-5 w-5" />
            Enter as Admin
          </Button>
        </Link>
      </div>
      
      <p className="mt-16 text-center text-sm text-muted-foreground">
        Note: This is a demo environment. Logins are simulated for showcase purposes.
      </p>
    </main>
  );
}
