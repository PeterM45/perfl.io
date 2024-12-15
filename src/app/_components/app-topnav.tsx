import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppTopnav() {
  return (
    <header className="bg-sidebar-background flex items-center justify-between p-4">
      <SidebarTrigger />
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  );
}
