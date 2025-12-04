import React from "react";
import LayoutContent from "./LayoutContent";
import { SidebarProvider } from "@/src/hooks/SlidebarProvider";
import { SessionProvider } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <LayoutContent>
        <SessionProvider>{children}</SessionProvider>
      </LayoutContent>
    </SidebarProvider>
  );
};

export default Layout;
