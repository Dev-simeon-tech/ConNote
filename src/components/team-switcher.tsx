"use client";

import * as React from "react";
import { useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/assets/logo.svg?react";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ReactNode;
    plan: string;
  }[];
}) {
  const [activeTeam] = React.useState(teams[0]);
  const navigate = useNavigate();
  if (!activeTeam) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground'
              />
            }
          >
            <div className=' aspect-square size-8 items-center justify-center '>
              <Logo className='min-w-full min-h-full' />
            </div>
            <div
              onClick={() => navigate("/home")}
              className='grid flex-1 text-left text-sm leading-tight'
            >
              <span className='truncate text-primary font-bold text-2xl'>
                {activeTeam.name}
              </span>
              <span className='truncate text-sidebar-text  uppercase text-xs tracking-widest'>
                {activeTeam.plan}
              </span>
            </div>
          </DropdownMenuTrigger>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
