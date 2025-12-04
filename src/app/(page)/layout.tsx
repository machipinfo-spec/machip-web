import React from "react";
import LayoutContent from "./LayoutContent";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <LayoutContent>{children}</LayoutContent>
  );
};

export default Layout;
