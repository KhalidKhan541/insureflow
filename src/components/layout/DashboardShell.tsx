'use client';

/**
 * InsureFlow — DashboardShell.
 *
 * Composes the collapsible `Sidebar`, the sticky `TopBar` and a padded `<main>`
 * content region. The main column is offset to clear the desktop rail
 * (`w-64` expanded / `w-20` collapsed on `lg`); on smaller screens the sidebar
 * is a drawer, so no offset applies.
 *
 * Providers (`ThemeProvider`, `SidebarProvider`, `NotificationProvider`) are
 * mounted once in the root layout.
 */

import type { ReactNode } from 'react';

import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { useIfSidebar } from '@/contexts/SidebarContext';
import { cn } from '@/lib/utils';

export interface DashboardShellProps {
  children: ReactNode;
  className?: string;
}

export function DashboardShell({ children, className }: DashboardShellProps) {
  const { isCollapsed } = useIfSidebar();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-[padding] duration-300 ease-if-out',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64',
          className
        )}
      >
        <TopBar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>

        <footer className="border-t border-border px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-[11px] text-muted-foreground">
            © {new Date().getFullYear()} InsureFlow · Policy, claims and underwriting operations
          </p>
        </footer>
      </div>
    </div>
  );
}

export default DashboardShell;
