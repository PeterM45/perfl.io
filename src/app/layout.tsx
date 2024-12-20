import "~/styles/globals.css";
import { Space_Mono } from "next/font/google";
import { type Metadata } from "next";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "~/app/_components/app-sidebar";
import { AppTopnav } from "~/app/_components/app-topnav";
import { ScrollArea } from "~/components/ui/scroll-area";

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
    <ClerkProvider>
      <html lang="en" className={spaceMono.className} suppressHydrationWarning>
        <body className="min-h-screen w-full">
          <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden">
              <SignedIn>
                <div className="flex h-full w-full">
                  <AppSidebar />
                  <div className="flex flex-1 flex-col">
                    <AppTopnav />
                    <ScrollArea
                      className="flex-1"
                      type="scroll"
                      scrollHideDelay={600}
                    >
                      <TRPCReactProvider>{children}</TRPCReactProvider>
                    </ScrollArea>
                  </div>
                </div>
              </SignedIn>

              <div className="flex-1">
                <SignedOut>
                  <ScrollArea
                    className="flex-1"
                    type="scroll"
                    scrollHideDelay={600}
                  >
                    <TRPCReactProvider>{children}</TRPCReactProvider>
                  </ScrollArea>
                </SignedOut>
              </div>
            </div>
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
