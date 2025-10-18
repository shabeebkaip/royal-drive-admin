import { type Icon } from "@tabler/icons-react"
import { ChevronRight } from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "~/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url?: string
    icon?: Icon
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const location = useLocation()

  const isItemActive = (itemUrl: string) => {
    const path = location.pathname
    if (itemUrl === "/") return path === "/"
    return path === itemUrl || path.startsWith(itemUrl + "/")
  }

  const isParentActive = (item: typeof items[0]) => {
    if (item.url && isItemActive(item.url)) return true
    if (item.items) {
      return item.items.some(subItem => isItemActive(subItem.url))
    }
    return false
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            // Item with submenu
            if (item.items && item.items.length > 0) {
              const [isOpen, setIsOpen] = useState(isParentActive(item))
              
              return (
                <Collapsible
                  key={item.title}
                  open={isOpen}
                  onOpenChange={setIsOpen}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip={item.title} isActive={isParentActive(item)} asChild>
                      <CollapsibleTrigger className="flex w-full items-center">
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    </SidebarMenuButton>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild isActive={isItemActive(subItem.url)}>
                              <Link to={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            }
            
            // Regular item without submenu
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} isActive={item.url ? isItemActive(item.url) : false} asChild>
                  <Link to={item.url || "#"} aria-current={item.url && isItemActive(item.url) ? "page" : undefined}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
