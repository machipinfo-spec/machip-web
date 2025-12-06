"use client";
import React from "react";
import { FaHome, FaBell, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { GiNotebook } from "react-icons/gi";
import { MdFitnessCenter } from "react-icons/md";
import SidebarContent from "./SidebarContent";
import SidebarMenuItem from "./SidebarMenuItem";

const Sidebar: React.FC = () => {
  return (
    <SidebarContent>
      <ul className="list-none p-0 m-0 pt-10">
        <SidebarMenuItem href="/home" icon={<FaHome />}>
          ホーム
        </SidebarMenuItem>

        <SidebarMenuItem href="/profile" icon={<FaUser />}>
          プロフィール
        </SidebarMenuItem>

        <SidebarMenuItem href="/map" icon={<GiNotebook />}>
          地図
        </SidebarMenuItem>

        <SidebarMenuItem href="/timeline" icon={<MdFitnessCenter />}>
          タイムライン
        </SidebarMenuItem>

        <SidebarMenuItem href="/profile" icon={<FaCog />}>
          大胸筋
        </SidebarMenuItem>

        <SidebarMenuItem href="/signout" icon={<FaSignOutAlt />}>
          大殿筋
        </SidebarMenuItem>
      </ul>
    </SidebarContent>
  );
};

export default Sidebar;
