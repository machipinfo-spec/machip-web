"use client";
import { useSidebar } from "@/src/hooks/SlidebarProvider";
import React from "react";
import { FaTimes } from "react-icons/fa";

interface SidebarContentProps {
  children: React.ReactNode;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ children }) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <nav className="relative">
      <div
        className={`
          w-[220px] bg-[#23272f] text-[#e0e6ed] h-screen 
          pt-8 px-4 pb-4 box-border transition-transform duration-300
          md:transform-none md:static
          fixed top-0 left-0 z-[100] shadow-[2px_0_8px_rgba(0,0,0,0.2)]
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* 閉じるボタン（モバイルのみ表示） */}
        {isOpen && (
          <div className="absolute top-4 right-4 md:hidden">
            <FaTimes
              onClick={toggle}
              className="text-xl cursor-pointer hover:text-white transition-colors"
            />
          </div>
        )}
        {children}
      </div>

      {/* オーバーレイ（モバイル時のみ） */}
      {isOpen && (
        <div
          className="fixed z-[99] top-0 left-0 w-screen h-screen bg-black/30 md:hidden"
          onClick={toggle}
        />
      )}
    </nav>
  );
};

export default SidebarContent;
