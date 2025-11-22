import * as React from "react";
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
} from "@tabler/icons-react";

import { NavDocuments } from "~/components/nav-documents";
import { NavMain } from "~/components/nav-main";
import { NavProcurement } from "~/components/nav-procurement";
import { NavSecondary } from "~/components/nav-secondary";
import { NavUser } from "~/components/nav-user";
import Logo from "~/components/shared/Logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

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
      icon: IconCar,
      items: [
        {
          title: "All Vehicles",
          url: "/vehicles",
        },
        {
          title: "Sold Vehicles",
          url: "/vehicles/sold",
        },
      ],
    },
    {
      title: "Sales",
      url: "/sales",
      icon: IconChartBar,
    },
  ],
  navProcurement: [
    {
      title: "Contact Enquiries", // General contact form submissions from website
      url: "/enquiries/contact",
      icon: IconFileDescription,
    },
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
      url: "/settings",
      icon: IconSettings,
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <img
        src="/Colour.svg"
        alt="Royal Drive Logo"
        className="w-full  h-20 object-contain"
      />
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProcurement items={data.navProcurement} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
    </Sidebar>
  );
}
