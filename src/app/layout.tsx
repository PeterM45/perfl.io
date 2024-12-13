import "~/styles/globals.css";
import { Space_Mono } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "~/app/_components/app-sidebar";

export const metadata: Metadata = {
  title: "perfl.io",
  description: "Create and share your portfolio — Coming Soon",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const spaceMono = Space_Mono({
  weight: "400",
  style: "normal",
  subsets: [],
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceMono.className} suppressHydrationWarning>
      <body className="min-h-screen w-full">
        <ClerkProvider>
          <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
              <SignedIn>
                <AppSidebar />
              </SignedIn>

              <div className="flex flex-1 flex-col">
                <header className="flex items-center justify-between border-b p-4">
                  <SignedIn>
                    <SidebarTrigger />
                  </SignedIn>
                  <div>
                    <SignedOut>
                      <SignInButton />
                    </SignedOut>
                    <SignedIn>
                      <UserButton afterSignOutUrl="/sign-in" />
                    </SignedIn>
                  </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                  <TRPCReactProvider>{children}</TRPCReactProvider>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
