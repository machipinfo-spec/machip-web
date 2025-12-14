import Footer from "@/src/components/layouts/Footer/footer";
import Header from "@/src/components/layouts/Header/header";
import React from "react";

interface LayoutContentProps {
  children: React.ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1 relative md:overflow-hidden">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default LayoutContent;
