"use client";
import { Home, Search, Settings } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const { openUserProfile } = useClerk();

  // Modified menu items with special handling for Settings
  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      onClick: () => (window.location.href = "/"),
    },
    {
      title: "Explore",
      url: "/explore",
      icon: Search,
      onClick: () => (window.location.href = "/explore"),
    },
    {
      title: "Settings",
      icon: Settings,
      onClick: () => openUserProfile(),
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>perfl.io</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <button onClick={item.onClick}>
                      <item.icon className="min-h-[22px] min-w-[22px]" />
                      <span className="text-lg">{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
