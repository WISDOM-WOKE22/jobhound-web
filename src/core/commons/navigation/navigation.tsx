'use client';

import AppSidebar from '../sidebar';
// import ModeToggle from "../theme";
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
import { useTheme } from 'next-themes';
import { MobileSidebar } from '../sidebar/mobileSidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useMainStore } from '@/lib/zustand/store';
import { UserRole } from '@/core/constants/sidebar';
import { useRouter } from 'next/navigation';
import { useLogoutService } from '@/hooks/auth/logout';
// import { NotificationCard } from '@/modules/dashboard/components/card/notification';

export default function NavBar({
  title,
  subHeading,
}: {
  title: string;
  subHeading?: string;
}) {
  const { setTheme } = useTheme();
  const user = useMainStore((state) => state.user);
  const { logout, isLoading } = useLogoutService();
  const router = useRouter();

  return (
    <nav className='h-14 border-b flex justify-between items-center w-full px-4 fixed z-1 backdrop-blur-md'>
      <AppSidebar userRole={(user?.role?.toUpperCase() as UserRole) || null} />
      <main className='flex justify-between items-center w-full relative backdrop-blur-md max-lg:hidden'>
        <div className='relative -left-2'>
          <h1 className='text-xl font-bold'>{title}</h1>
          <p className='text-[12px] text-gray-600 dark:text-gray-300'>
            {subHeading}
          </p>
        </div>
        <div className='flex flex-row items-center gap-2'>
          {/* <NotificationCard /> */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className='cursor-pointer'>
                {user?.photo ? (
                  <AvatarImage src={user.photo} />
                ) : (
                  <AvatarFallback>
                    {user?.firstName?.slice(0, 1)}
                    {user?.lastName?.slice(0, 1)}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <div className='border-b p-1 w-full min-w-[180px]'>
                <div className='flex flex-col text-sm'>
                  <span className='font-medium'>{user?.firstName}</span>
                  <span className='text-xs text-muted-foreground'>
                    {user?.email}
                  </span>
                </div>
              </div>
              <DropdownMenuItem
                onClick={() => router.push('/dashboard/settings')}
                className='cursor-pointer'
              >
                Setting
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
              {isLoading ? (
                <DropdownMenuItem className='bg-red-400'>
                  logging out...
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className='bg-red-400 cursor-pointer'
                  onClick={() => logout()}
                >
                  logout
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </main>

      {/* Mobile Navigation */}
      <main className='w-full justify-between items-center flex flex-row lg:hidden'>
        <MobileSidebar userRole={user?.role || null} />
        <h1 className='text-xl' onClick={() => router.push('/dashboard')}>
          {user?.firstName} {user?.lastName}
        </h1>
        {/* <NotificationCard /> */}
      </main>
    </nav>
  );
}
