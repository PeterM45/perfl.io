import "~/styles/globals.css";
import { Space_Mono } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "~/app/_components/app-sidebar";
import { AppTopnav } from "~/app/_components/app-topnav";

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
                <div className="flex h-full w-full">
                  <AppSidebar />
                  <div className="flex flex-1 flex-col">
                    <AppTopnav />
                    <main className="flex-1 overflow-y-auto">
                      <TRPCReactProvider>{children}</TRPCReactProvider>
                    </main>
                  </div>
                </div>
              </SignedIn>

              <div className="flex-1">
                <SignedOut>
                  <main className="h-full w-full">
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                  </main>
                </SignedOut>
              </div>
            </div>
          </SidebarProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
