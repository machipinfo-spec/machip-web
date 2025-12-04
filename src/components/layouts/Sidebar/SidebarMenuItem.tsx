"use client";
import React from "react";
import Link from "next/link";
import { useSidebar } from "@/src/hooks/SlidebarProvider";

interface SidebarMenuItemProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  badgeCount?: number; // 通知バッジの数
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  href,
  icon,
  children,
  badgeCount,
}) => {
  const { toggle } = useSidebar();

  // リンククリック時にメニューを閉じる関数（モバイルのみ）
  const handleLinkClick = () => {
    // モバイルでのみメニューを閉じる
    if (window.innerWidth <= 768) {
      toggle();
    }
  };

  return (
    <li className="flex items-center gap-3 py-3 text-base">
      <Link
        href={href}
        className="
          color-inherit no-underline flex items-center gap-2
          hover:text-white transition-colors duration-200
          w-full
        "
        onClick={handleLinkClick}
      >
        <div className="relative flex items-center">
          <span className="text-[1.3rem]">{icon}</span>
          {badgeCount && badgeCount > 0 && (
            <span
              className="
              absolute -top-2 -right-2 bg-[#e74c3c] text-white rounded-full
              min-w-[18px] min-h-[18px] flex items-center justify-center
              text-[0.7rem] font-bold px-0.5 box-border
              border-2 border-[#23272f]
            "
            >
              {badgeCount > 99 ? "99+" : badgeCount}
            </span>
          )}
        </div>
        {children}
      </Link>
    </li>
  );
};

export default SidebarMenuItem;
