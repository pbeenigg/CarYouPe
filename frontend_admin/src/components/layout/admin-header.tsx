"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Bell, Loader2, User, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "@/i18n/routing"

import { useTranslations } from 'next-intl';

export function AdminHeader() {
  const { user, roles, loading, logout } = useAuth();
  const t = useTranslations('Header');
  const tCommon = useTranslations('Common');

  const displayName = user?.nickname || user?.username || t('guest');
  // Use DiceBear for random avatars based on username
  const avatarUrl = user?.avatar_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.username || 'guest'}`;
  
  // Display role: Superuser or the first role in the list, or 'User'
  const getRoleName = (role: any) => {
    if (typeof role === 'string') return role;
    if (typeof role === 'object' && role?.name) return role.name;
    return t('userRole');
  };

  const displayRole = user?.is_superuser 
    ? t('superAdmin') 
    : (roles.length > 0 ? getRoleName(roles[0]) : t('userRole'));

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 shadow-sm">
      <div className="flex flex-1 items-center gap-2">
        {/* <h1 className="text-lg font-semibold">Dashboard</h1> */}
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border border-background"></span>
        </Button>
        <ThemeToggle />
        <LanguageToggle />
        
        <div className="ml-2 pl-4 border-l flex items-center">
          {loading ? (
             <div className="flex items-center gap-2">
               <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
               <div className="hidden md:flex flex-col gap-1">
                 <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                 <div className="h-3 w-12 bg-muted animate-pulse rounded"></div>
               </div>
             </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 flex items-center gap-3 rounded-full pl-0 hover:bg-transparent">
                  <div className="h-9 w-9 rounded-full overflow-hidden border-2 border-primary/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={avatarUrl} 
                      alt={displayName} 
                      className="h-full w-full object-cover bg-background" 
                    />
                  </div>
                  <div className="hidden flex-col items-start md:flex">
                    <span className="text-sm font-semibold leading-none">{displayName}</span>
                    <span className="text-xs text-muted-foreground mt-1 bg-secondary px-1.5 py-0.5 rounded-sm">
                      {displayRole}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t('profile')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t('settings')}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
