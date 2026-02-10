'use client';

import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLogoutService } from '@/hooks/auth/logout';
import {
  SidebarMenuItem,
  SidebarMenu,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSubTrigger,
  DropdownMenuSub,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  PERMISSIONS,
  AppSidebarProps,
  MENU_ITEMS,
  MenuItem,
} from '../../constants/sidebar';
import { useMainStore } from '@/lib/zustand/store';
import { Logo } from '@/assets/svg';
import { cn } from '@/lib/utils';

export function MobileSidebar({ userRole }: AppSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const { logout, isLoading } = useLogoutService();
  const user = useMainStore((state) => state.user);

  const closeSheet = () => setOpen(false);

  const allowedPermissions: string[] = userRole
    ? Array.from(
        PERMISSIONS[userRole as string as keyof typeof PERMISSIONS] || []
      )
    : [];
  const accessibleMenuItems = MENU_ITEMS.filter(
    (item) => item.permission !== null
  ).filter((item) => allowedPermissions.includes(item.permission as string));

  const groupedMenuItems = accessibleMenuItems.reduce(
    (groups, item) => {
      const group = groups[item.group] || [];
      group.push(item);
      groups[item.group] = group;
      return groups;
    },
    {} as Record<string, MenuItem[]>
  );

  const isActive = (href: string) => {
    if (href === pathname) return true;
    const baseRoute = href.split('/')[1];
    const currentRoute = pathname.split('/')[1];
    if (baseRoute === currentRoute && href !== '/') return true;
    if (pathname.startsWith(href) && href !== '/') return true;
    return false;
  };

  const formatGroupName = (name: string) => {
    const groupLabels: Record<string, string> = {
      overview: 'Overview',
      management: 'User Management',
      exams: 'Exam Management',
      communication: 'Communication',
      settings: 'System Settings',
      applications: 'Applications',
    };
    return groupLabels[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-xl lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[280px] flex-col gap-0 border-r border-sidebar-border bg-sidebar p-0"
      >
        {/* Header: Logo + Job Hound */}
        <div className="flex shrink-0 border-b border-sidebar-border">
          <Link
            href="/home"
            onClick={closeSheet}
            className="flex items-center gap-3 px-4 py-4 outline-none ring-sidebar-ring transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-inset"
          >
            <Logo className="h-9 w-9 shrink-0" />
            <span className="font-semibold text-sidebar-foreground text-base tracking-tight">
              Job Hound
            </span>
          </Link>
        </div>

        {/* Nav */}
        <div className="min-h-0 flex-1 overflow-y-auto py-4">
          <SidebarMenu className="flex flex-col gap-6 px-3">
            {Object.entries(groupedMenuItems).map(([group, items]) => (
              <div key={group} className="flex flex-col gap-1">
                <div className="px-3 mb-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {formatGroupName(group)}
                  </span>
                </div>
                {items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active}>
                        <Link
                          href={item.href}
                          onClick={closeSheet}
                          className={cn(
                            'h-11 flex items-center gap-3 rounded-xl px-3 font-medium transition-colors',
                            active
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground'
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                              active
                                ? 'bg-primary-foreground/20'
                                : 'bg-sidebar-accent/50'
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="truncate">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </div>
            ))}
          </SidebarMenu>
        </div>

        {/* Footer: User + Logout */}
        <div className="shrink-0 border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/30 px-3 py-2.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left outline-none ring-sidebar-ring focus-visible:ring-2"
                >
                  <Avatar className="h-9 w-9 shrink-0 ring-2 ring-sidebar-border">
                    {user?.photo ? (
                      <AvatarImage src={user?.photo} alt="" />
                    ) : (
                      <AvatarFallback className="text-xs font-semibold bg-primary text-primary-foreground">
                        {user?.firstName?.slice(0, 1)}
                        {user?.lastName?.slice(0, 1)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-sidebar-foreground">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        Light
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        Dark
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>
                        System
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
              onClick={() => logout()}
              disabled={isLoading}
              aria-label="Log out"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
