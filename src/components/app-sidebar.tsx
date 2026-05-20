"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import Logo from "@/assets/logo.svg?react";
import Sparkler from "@/assets/sparkler.svg?react";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  ArrowLeftRight,
  FileText,
  Settings2Icon,
  History,
  House,
} from "lucide-react";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ConNote",
      logo: <Logo />,
      plan: "Precision Workspace",
    },
  ],
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: <House />,
    },
    {
      title: "Converters",
      url: "/converters",
      icon: <ArrowLeftRight />,
      items: [
        {
          title: "Currency",
          url: "/converters/currency",
        },
        {
          title: "Length",
          url: "/converters/length",
        },
        {
          title: "Weight",
          url: "/converters/weight",
        },
        {
          title: "Time",
          url: "/converters/time",
        },
        {
          title: "Temperature",
          url: "/converters/temperature",
        },
        {
          title: "Area",
          url: "/converters/area",
        },
        {
          title: "Speed",
          url: "/converters/speed",
        },
      ],
    },
    {
      title: "AI Tools",
      url: "/ai-tools",
      icon: <Sparkler width={30} height={30} />,
      items: [
        {
          title: "Pdf & pptx Summarizer",
          url: "tools/summarizer",
        },
        {
          title: "Quiz Generator",
          url: "/quiz",
        },
      ],
    },
    {
      title: "My Document",
      url: "/documents",
      icon: <FileText />,
    },
    {
      title: "Quiz History",
      url: "/quiz-history",
      icon: <History />,
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
    },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: <FrameIcon />,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: <PieChartIcon />,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: <MapIcon />,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='bg-surface'>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className='text-sidebar-text bg-surface'>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter className='bg-surface'>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
