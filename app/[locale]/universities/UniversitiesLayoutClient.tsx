"use client";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UniversitySidebar } from "@/components/universities/UniversitySidebar";

/**
 * Matches shadcn sidebar docs: SidebarProvider wraps Sidebar + SidebarInset as
 * direct siblings (no wrapper) so the sidebar’s in-flow spacer pushes content.
 * https://ui.shadcn.com/docs/components/sidebar
 */
export function UniversitiesLayoutClient({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="flex h-svh w-full flex-row overflow-hidden">
      <UniversitySidebar locale={locale} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4 md:px-6">
          <SidebarTrigger className="-ml-1 size-9 shrink-0 transition-opacity duration-300 hover:opacity-90" />
          <div className="h-4 w-px shrink-0 bg-border" aria-hidden />
          <span className="text-muted-foreground min-w-0 truncate text-sm font-medium tracking-tight">
            University dashboard
          </span>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
