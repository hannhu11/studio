
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  ClipboardList,
  BookOpen,
  Users,
  Home,
  LogOut,
  Loader2,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { useAuth } from '@/hooks/use-auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname.startsWith(path);
  const { user, isAdmin, loading, signOut } = useAuth();

  React.useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/');
    }
  }, [user, isAdmin, loading, router]);
  
  if (loading || !user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center justify-between">
              <Logo href="/admin/dashboard" />
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/admin/dashboard" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === '/admin/dashboard'}
                    tooltip="Dashboard"
                  >
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/quizzes" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={isActive('/admin/quizzes')}
                    tooltip="Quizzes"
                  >
                    <ClipboardList />
                    <span>Quizzes</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/lessons" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={isActive('/admin/lessons')}
                    tooltip="Lessons"
                  >
                    <BookOpen />
                    <span>Lessons</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/results" passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={isActive('/admin/results')}
                    tooltip="Results"
                  >
                    <Users />
                    <span>User Results</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                  <SidebarMenuButton onClick={signOut}>
                      <LogOut />
                      <span>Logout</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                  <Link href="/" passHref legacyBehavior>
                      <SidebarMenuButton>
                          <Home />
                          <span>Back to Home</span>
                      </SidebarMenuButton>
                  </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="p-4 sm:p-6 lg:p-8">{children}</SidebarInset>
      </SidebarProvider>
  );
}
