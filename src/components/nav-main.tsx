import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import { useLocation } from "react-router";
import { Link } from "react-router";
import { Button } from "./ui/button";
import useUser from "@/hooks/useUser";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: React.ReactNode;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { user } = useUser();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <>
            {item.items?.length ? (
              <Collapsible
                key={item.title}
                defaultOpen={item.isActive}
                className='group/collapsible'
                render={<SidebarMenuItem />}
              >
                <CollapsibleTrigger
                  render={
                    <SidebarMenuButton
                      isActive={item.url === pathname}
                      tooltip={item.title}
                      className='hover:bg-border hover:text-primary data-active:bg-sidebar-active-bg'
                    />
                  }
                >
                  <a className='flex gap-2 items-center' href={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                  <ChevronRightIcon className='ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90' />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          isActive={subItem.url === pathname}
                          className='hover:bg-border  data-active:bg-sidebar-active-bg'
                          render={<a href={subItem.url} />}
                        >
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  className=' hover:bg-border hover:text-primary data-active:bg-sidebar-active-bg'
                  isActive={item.url === pathname}
                >
                  <a
                    href={item.url}
                    className='font-medium flex gap-2 items-center '
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </>
        ))}
        {!user && (
          <SidebarMenuItem className='flex gap-2 flex-col  mt-4'>
            <Link className='md:hidden block' to={"/login"}>
              <Button variant={"outline"} className={"px-6 w-full"} size={"lg"}>
                Log In
              </Button>
            </Link>
            <Link className='md:hidden block' to={"/signup"}>
              <Button className={"px-6 w-full"} size={"lg"}>
                Sign Up
              </Button>
            </Link>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
