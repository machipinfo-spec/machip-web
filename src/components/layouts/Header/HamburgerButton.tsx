"use client";
import { useSidebar } from "@/src/hooks/SlidebarProvider";
import React from "react";
import { FaBars } from "react-icons/fa";

interface HamburgerButtonProps {
  className?: string;
}

const HamburgerButton: React.FC<HamburgerButtonProps> = ({
  className = "",
}) => {
  const { isOpen, toggle } = useSidebar();

  return (
    <button
      className={`
        bg-transparent border-none text-2xl text-blue-600 
        cursor-pointer transition-colors duration-200 
        hover:text-blue-700 focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-opacity-50 rounded
        ${className}
      `}
      onClick={toggle}
      aria-label="メニュー"
      aria-expanded={isOpen}
    >
      {!isOpen && <FaBars />}
    </button>
  );
};

export default HamburgerButton;
