"use client"

import { useAuth } from "@/providers/auth-provider";
import React from "react";

interface PermissionGuardProps {
  permission?: string;
  role?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 权限守卫组件
 * 根据用户权限或角色控制子组件的显示
 * 
 * @example
 * <PermissionGuard permission="products:delete">
 *   <Button>Delete</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({ 
  permission, 
  role, 
  children, 
  fallback = null 
}: PermissionGuardProps) {
  const { hasPermission, hasRole } = useAuth();

  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
