'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);

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
          <Link href="/" passHref legacyBehavior>
            <SidebarMenuButton>
                <Home />
                <span>Back to Home</span>
            </SidebarMenuButton>
          </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4 sm:p-6 lg:p-8">{children}</SidebarInset>
    </SidebarProvider>
  );
}
