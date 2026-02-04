"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  { href: "", label: "Dashboard", icon: LayoutDashboard },
  { href: "/players", label: "Players", icon: Users },
  { href: "/events", label: "Events", icon: CalendarDays },
] as const;

type UniversitySidebarProps = {
  locale: string;
};

export function UniversitySidebar({ locale }: UniversitySidebarProps) {
  const pathname = usePathname();
  const basePath = `/${locale}/universities`;

  return (
    <Sidebar
      collapsible="icon"
      className="[&_[data-active=true]]:bg-primary [&_[data-active=true]]:text-primary-foreground [&_[data-active=true]]:font-medium flex flex-col"
    >
      <SidebarHeader className="shrink-0 border-b border-sidebar-border p-2 group-data-[collapsible=icon]:pl-[9px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild tooltip="University Hub">
              <Link href={basePath} className="flex min-w-0 items-center justify-center gap-2 group-data-[collapsible=icon]:justify-center">
                <GraduationCap className="size-6 shrink-0 text-primary group-data-[collapsible=icon]:size-5" />
                <span className="truncate font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
                  University Hub
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="min-h-0 flex-1 overflow-auto">
        <SidebarGroup className="group-data-[collapsible=icon]:pl-[9px]">
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ href, label, icon: Icon }) => {
                const fullPath = `${basePath}${href}`;
                const isActive =
                  href === ""
                    ? pathname === basePath
                    : pathname.startsWith(fullPath);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={label}
                      asChild
                    >
                      <Link href={fullPath} className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                        <Icon className="shrink-0" />
                        <span className="truncate group-data-[collapsible=icon]:hidden">{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="shrink-0 border-t border-sidebar-border p-2 group-data-[collapsible=icon]:pl-[9px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to GamerPlug">
              <Link
                href={`/${locale}`}
                className="text-muted-foreground hover:text-primary flex min-w-0 items-center transition-colors duration-300 group-data-[collapsible=icon]:justify-center"
              >
                <ArrowLeft className="hidden size-4 shrink-0 group-data-[collapsible=icon]:block" />
                <span className="truncate text-xs group-data-[collapsible=icon]:hidden">
                  ← Back to{" "}
                  <span className="font-extrabold italic tracking-tight">
                    GAMER<span className="text-primary">PLUG</span>
                  </span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
