import { Building2, type LucideIcon, MapPinned, UsersRound } from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Real Estate Operations",
    items: [
      {
        id: "realty-terminal",
        title: "Realty Terminal",
        url: "/dashboard/real-estate",
        icon: Building2,
        badge: "new",
      },
      {
        id: "buyers",
        title: "Buyer Pipeline",
        url: "/dashboard/real-estate#buyers",
        icon: UsersRound,
      },
      {
        id: "markets",
        title: "Markets",
        url: "/dashboard/real-estate#markets",
        icon: MapPinned,
      },
    ],
  },
];
