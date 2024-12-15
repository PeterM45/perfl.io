"use client";
import { Home, Search, Settings, UserRound } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

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
      title: "Profile",
      url: "/profile",
      icon: UserRound,
      onClick: () => (window.location.href = `/profile/${user?.username}`),
    },
    {
      title: "Settings",
      icon: Settings,
      onClick: () => openUserProfile(),
    },
  ];

  return (
    <Sidebar variant="inset">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-md">perfl.io</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <button onClick={item.onClick}>
                      {/* Conditional rendering for Profile */}
                      {item.title === "Profile" ? (
                        <img
                          src={user?.imageUrl || "/default-profile.png"}
                          alt="Profile"
                          className="rounded-full min-h-[22px] min-w-[22px] object-cover"
                          style={{ height: '22px', width: '22px' }}
                        />
                      ) : (
                        <item.icon className="min-h-[22px] min-w-[22px]" />
                      )}
                      <span className="text-lg tracking-wide">
                        {item.title}
                      </span>
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
