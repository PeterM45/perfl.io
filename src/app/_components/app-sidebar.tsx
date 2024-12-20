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
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const items = [
    {
      title: "Home",
      icon: Home,
      onClick: () => router.push("/"),
    },
    {
      title: "Explore",
      icon: Search,
      onClick: () => router.push("/explore"),
    },
    {
      title: "Profile",
      icon: ({ className }: { className?: string }) =>
        isLoaded ? (
          <Image
            src={user?.imageUrl ?? ""}
            alt="Profile"
            width={22}
            height={22}
            className={`min-h-[22px] min-w-[22px] rounded-full object-cover ${className ?? ""}`}
          />
        ) : (
          <UserRound
            className={`min-h-[22px] min-w-[22px] ${className ?? ""}`}
          />
        ),
      onClick: () => user?.username && router.push(`/profile/${user.username}`),
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
                      <item.icon className="min-h-[22px] min-w-[22px]" />
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
