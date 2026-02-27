"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/providers/sidebar-provider";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Car,
  ShieldCheck,
  Menu as MenuIcon,
  FolderTree,
  Store,
  GitBranch,
  Wallet,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "admin" | "dealer" | "partner";
}

export function AdminSidebar({ className, role = "admin" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Sidebar");
  const { collapsed, toggleCollapsed } = useSidebar();

  const handleLogout = async () => {
    try {
      await api.post("/admin/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const routes = [
    {
      label: t("dashboard"),
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      label: t("users"),
      icon: Users,
      href: "/admin/users",
      active: pathname.startsWith("/admin/users"),
    },
    {
      label: t("roles"),
      icon: ShieldCheck,
      href: "/admin/roles",
      active: pathname.startsWith("/admin/roles"),
    },
    {
      label: t("menus"),
      icon: MenuIcon,
      href: "/admin/menus",
      active: pathname.startsWith("/admin/menus"),
    },
    {
      label: t("products"),
      icon: Package,
      href: "/admin/products",
      active: pathname.startsWith("/admin/products"),
    },
    {
      label: t("orders"),
      icon: ShoppingCart,
      href: "/admin/orders",
      active: pathname.startsWith("/admin/orders"),
    },
    {
      label: t("cars"),
      icon: Car,
      href: "/admin/cars",
      active: pathname.startsWith("/admin/cars"),
    },
    {
      label: t("categories"),
      icon: FolderTree,
      href: "/admin/categories",
      active: pathname.startsWith("/admin/categories"),
    },
    {
      label: t("stores"),
      icon: Store,
      href: "/admin/stores",
      active: pathname.startsWith("/admin/stores"),
    },
    {
      label: t("distributions"),
      icon: GitBranch,
      href: "/admin/distributions",
      active: pathname.startsWith("/admin/distributions"),
    },
    {
      label: t("wallets"),
      icon: Wallet,
      href: "/admin/wallets",
      active: pathname.startsWith("/admin/wallets"),
    },
  ];

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className,
        )}
      >
        {/* Brand */}
        <div className="px-3 py-4">
          <div
            className={cn(
              "flex items-center gap-2 px-2 mb-2",
              collapsed && "justify-center px-0",
            )}
          >
            <Car className="h-6 w-6 shrink-0 text-primary" />
            {!collapsed && (
              <h2 className="text-xl font-bold tracking-tight">{t("brand")}</h2>
            )}
          </div>
        </div>

        {/* Nav routes - scrollable */}
        <nav className="flex-1 overflow-y-auto px-3">
          <div className="space-y-1">
            {routes.map((route) => (
              <Tooltip key={route.href}>
                <TooltipTrigger asChild>
                  <Link href={route.href}>
                    <Button
                      variant={route.active ? "secondary" : "ghost"}
                      className={cn(
                        "w-full",
                        collapsed ? "justify-center px-0" : "justify-start",
                      )}
                      size={collapsed ? "icon" : "default"}
                    >
                      <route.icon
                        className={cn("h-4 w-4 shrink-0", !collapsed && "mr-2")}
                      />
                      {!collapsed && route.label}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">{route.label}</TooltipContent>
                )}
              </Tooltip>
            ))}
          </div>
        </nav>

        {/* Bottom actions: icon-only row */}
        <div
          className={cn(
            "mt-auto border-t px-2 py-2 flex items-center gap-1",
            collapsed ? "flex-col" : "flex-row justify-center",
          )}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/admin/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top">{t("settings")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">{t("logout")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleCollapsed}>
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              {collapsed ? t("expand") : t("collapse")}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
