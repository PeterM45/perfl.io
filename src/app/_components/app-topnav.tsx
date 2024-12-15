import { UserButton } from "@clerk/nextjs";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppTopnav() {
  return (
    <header className="flex items-center justify-between border-b p-4">
      <SidebarTrigger />
      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  );
}
