
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
  BookOpen,
  History,
  LogOut,
} from 'lucide-react';
import { Logo } from '@/components/shared/Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname.startsWith(path);
  const { user, signOut } = useAuth();
  
  if (!user) {
    // This should ideally not happen due to the logic in AuthProvider,
    // but it's a good failsafe.
    return null; 
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center justify-between">
            <Logo href="/user/dashboard" />
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/user/dashboard" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === '/user/dashboard'}
                  tooltip="Dashboard"
                >
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/user/lessons" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={isActive('/user/lessons')}
                  tooltip="Lessons"
                >
                  <BookOpen />
                  <span>Study Lessons</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/user/history" passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={isActive('/user/history')}
                  tooltip="History"
                >
                  <History />
                  <span>Quiz History</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start items-center gap-3 p-2 h-auto text-left">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} data-ai-hint="person avatar" />
                      <AvatarFallback>{user.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-left group-data-[collapsible=icon]:hidden">
                      <span className="text-sm font-medium text-sidebar-foreground">
                        {user.displayName}
                      </span>
                    </div>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4 sm:p-6 lg:p-8">{children}</SidebarInset>
    </SidebarProvider>
  );
}
