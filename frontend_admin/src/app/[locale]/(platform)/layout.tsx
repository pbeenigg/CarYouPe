"use client";

import React from "react";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { AuthProvider } from "@/providers/auth-provider";
import { SidebarProvider } from "@/providers/sidebar-provider";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="flex h-screen overflow-hidden bg-background">
          <div className="hidden md:block h-full">
            <AdminSidebar />
          </div>
          <div className="flex flex-1 flex-col overflow-hidden">
            <AdminHeader />
            <main className="flex-1 overflow-y-auto p-6">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
