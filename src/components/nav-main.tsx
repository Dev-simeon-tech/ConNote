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
                      className='hover:bg-border hover:text-primary'
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
                          className='hover:bg-border hover:text-primary data-active:bg-sidebar-active-bg'
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
      </SidebarMenu>
    </SidebarGroup>
  );
}
