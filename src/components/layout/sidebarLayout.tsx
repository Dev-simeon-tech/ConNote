import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "@base-ui/react";
import { Outlet } from "react-router";
import { Button } from "../ui/button";
import { Link } from "react-router";

const SidebarLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4 '>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
          </div>
          <div className='flex items-center w-full px-10 pt-1'>
            <input
              className='w-1/2 px-5 py-2 rounded-2xl border-2 '
              type='search'
              placeholder='search....'
              name=''
              id=''
            />
            <div className='ml-auto flex gap-4 items-center'>
              <Link to={"/login"}>
                <button>Log In</button>
              </Link>
              <Link to={"/signup"}>
                <Button className={"px-6 "} size={"lg"}>
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SidebarLayout;
