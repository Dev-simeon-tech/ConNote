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
import { ProfileDropdown } from "../profileDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useUser from "@/hooks/useUser";

const SidebarLayout = () => {
  const { user } = useUser();

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
            <div className='ml-auto flex gap-4 items-center'>
              {user ? (
                <ProfileDropdown
                  Trigger={
                    <Avatar>
                      <AvatarImage
                        referrerPolicy='no-referrer'
                        src={user.user_metadata.picture}
                      />
                      <AvatarFallback className={"text-primary  text-xl"}>
                        {user.user_metadata.name?.charAt(0).toUpperCase() ||
                          user.user_metadata.display_name
                            ?.charAt(0)
                            .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  }
                />
              ) : (
                <>
                  <Link className='hidden md:block' to={"/login"}>
                    <button>Log In</button>
                  </Link>
                  <Link className='hidden md:block' to={"/signup"}>
                    <Button className={"px-6 "} size={"lg"}>
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>

        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default SidebarLayout;
