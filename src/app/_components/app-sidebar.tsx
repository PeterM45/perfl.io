"use client";

import { useRouter } from "next/navigation";
import { Home, Search, Settings, UserRound } from "lucide-react";
import { useClerk, useUser } from "@clerk/nextjs";
import Image from "next/image";

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
  const router = useRouter(); 

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
      onClick: () => router.push("/"),
    },
    {
      title: "Explore",
      url: "/explore",
      icon: Search,
      onClick: () => router.push("/explore"), 
    },
    {
      title: "Profile",
      url: `/profile/${user?.username}`,
      icon: UserRound,
      onClick: () => router.push(`/profile/${user?.username}`), 
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
                      {item.title === "Profile" ? (
                        <Image
                          src={user?.imageUrl || "/default-profile.png"}
                          alt="Profile"
                          width={22}
                          height={22}
                          className="rounded-full min-h-[22px] min-w-[22px] object-cover"
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