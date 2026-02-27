"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: "admin" | "dealer" | "partner";
}

export function AdminSidebar({ className, role = "admin" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Sidebar");

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
    <div
      className={cn(
        "pb-12 w-64 border-r bg-sidebar text-sidebar-foreground",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 mb-6">
            <Car className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold tracking-tight">{t("brand")}</h2>
          </div>
          <div className="space-y-1">
            {routes.map((route) => (
              <Link key={route.href} href={route.href}>
                <Button
                  variant={route.active ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <route.icon className="mr-2 h-4 w-4" />
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {t("settings")}
          </h2>
          <div className="space-y-1">
            <Link href="/admin/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                {t("settings")}
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
