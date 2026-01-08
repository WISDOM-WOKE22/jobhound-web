import {
    LayoutDashboard,
    FileText,
    Settings,
  } from 'lucide-react';
  
  export type UserRole =
    | 'SUPER_ADMIN'
    | 'ADMIN'
    | 'SUB_ADMIN'
    | 'USER'
    | 'user'
    | 'admin'
    | 'sub-admin';
  
  export interface MenuItem {
    href: string;
    label: string;
    icon: React.ElementType;
    permission: string | null;
    group: string;
  }
  
  export const PERMISSIONS = {
    SUPER_ADMIN: [
      'home', 
      "applications",
      "settings",
    ],
    ADMIN: [
      'home',
    ],
    SUB_ADMIN: ['home'],
    USER: [
      'home',
      "applications",
      'settings',
      // 'notes'
    ],
  } as const;
  
  export const MENU_ITEMS: MenuItem[] = [
    {
      href: '/home',
      label: 'Home',
      icon: LayoutDashboard,
      permission: 'home',
      group: 'overview',
    },
    {
      href: '/applications',
      label: 'Applications',
      icon: FileText,
      permission: 'applications',
      group: 'applications',
    },
    {
      href: '/settings',
      label: 'Settings',
      icon: Settings,
      permission: 'settings',
      group: 'settings',
    }

  ];
  
  export interface AppSidebarProps {
    userRole: UserRole | undefined | null;
    className?: string;
  }
  