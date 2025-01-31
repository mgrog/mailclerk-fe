"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Users, Settings, Shield, Activity, Menu, Slash } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const urlSegments = pathname
    .split("/")
    .filter(Boolean)
    .slice(1)
    .map((segment) => segment.replaceAll("-", " "));

  const navItems = [
    { href: "/dashboard", icon: Users, label: "Team" },
    { href: "/dashboard/general", icon: Settings, label: "General" },
    { href: "/dashboard/activity", icon: Activity, label: "Activity" },
    { href: "/dashboard/security", icon: Shield, label: "Security" },
  ];

  return (
    <SidebarProvider>
      <main className="flex flex-1">
        <Sidebar>
          <SidebarHeader>Mailclerk</SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Stats</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={"/app"}>Overview</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={"/app/settings/sorting-rules"}>Sorting Rules</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={"/app/settings/auto-cleanup"}>Auto Cleanup</a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarRail />
        </Sidebar>
        {/* Main content */}
        <div className="flex flex-col flex-1">
          <header className="flex w-full h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {urlSegments.length === 0 ? <BreadcrumbPage>Stats</BreadcrumbPage> : null}
                {urlSegments.map((segment, index) =>
                  index < urlSegments.length - 1 ? (
                    <React.Fragment key={`${segment}-item`}>
                      <BreadcrumbItem className="capitalize font-semibold">
                        {segment}
                      </BreadcrumbItem>
                      {index !== urlSegments.length - 1 ? <BreadcrumbSeparator /> : null}
                    </React.Fragment>
                  ) : (
                    <BreadcrumbPage key={`${segment}-page`} className="capitalize font-semibold">
                      {segment}
                    </BreadcrumbPage>
                  ),
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <div className="flex flex-1 flex-col bg-background">
            <div className="flex flex-col w-full max-w-8xl overflow-y-auto">{children}</div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
