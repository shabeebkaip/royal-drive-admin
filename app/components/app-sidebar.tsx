import * as React from "react"
import {
  IconCar,
  IconCategory,
  IconChartBar,
  IconCreditCard,
  IconDashboard,
  IconDatabase,
  IconFileDescription,
  IconFileText,
  IconGasStation,
  IconSettings,
  IconShieldLock,
} from "@tabler/icons-react"

import { NavDocuments } from "~/components/nav-documents"
import { NavMain } from "~/components/nav-main"
import { NavProcurement } from "~/components/nav-procurement"
import { NavSecondary } from "~/components/nav-secondary"
import { NavUser } from "~/components/nav-user"
import Logo from "~/components/shared/Logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  avatar: "/favicon.svg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Inventory",
      url: "/vehicles",
      icon: IconCar,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: IconChartBar,
    },
  ],
  navProcurement: [
    {
      title: "Vehicle Enquiries", // Leads generated from inventory vehicle detail pages
      url: "/enquiries/vehicles", // Updated route to reflect vehicle-originated enquiries
      icon: IconFileDescription,
    },
    {
      title: "Car Submissions", // Public sell-your-car submissions management
      url: "/car-submissions",
      icon: IconCar,
    },
    {
      title: "Financing Enquiries",
      url: "/enquiries/financing",
      icon: IconCreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Terms & Conditions",
      url: "/legal/terms",
      icon: IconFileText,
    },
    {
      title: "Privacy Policy",
      url: "/legal/privacy",
      icon: IconShieldLock,
    },
  ],
  documents: [
    {
      name: "Brand",
      url: "/makes",
      icon: IconDatabase,
    },
    {
      name: "Types", 
      url: "/vehicle-types",
      icon: IconCategory,
    },
    {
      name: "Models",
      url: "/models",
      icon: IconCar,
    },
    {
      name: "Fuel Types",
      url: "/fuel-types",
      icon: IconGasStation,
    },
    {
      name: "Transmissions",
      url: "/transmissions",
      icon: IconSettings,
    },
    {
      name: "Drive Types",
      url: "/drive-types",
      icon: IconSettings,
    },
    {
      name: "Status",
      url: "/status",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" aria-label="Royal Drive">
                <Logo size="sm" variant="dark" className="select-none" />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProcurement items={data.navProcurement} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
