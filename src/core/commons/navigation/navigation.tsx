'use client';

import Link from 'next/link';
import AppSidebar from '../sidebar';
// import { SidebarTrigger } from '@/components/ui/sidebar';
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
import { useLogoutService } from '@/hooks/auth/logout';
import { Logo } from '@/assets/svg';

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

  const userRoleProp = (user?.role?.toUpperCase() as UserRole) || null;

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md'>
      <AppSidebar userRole={userRoleProp} />
      {/* Desktop: title + avatar */}
      <main className='flex w-full items-center justify-between backdrop-blur-md max-lg:hidden'>
        <div className='flex items-center gap-2'>
          {/* <SidebarTrigger className='size-8 shrink-0 rounded-lg' /> */}
          <div>
            <h1 className='text-xl font-bold'>{title}</h1>
            <p className='text-[12px] text-muted-foreground'>{subHeading}</p>
          </div>
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
              <DropdownMenuItem asChild>
                <Link href='/settings'>Settings</Link>
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

      {/* Mobile: menu trigger, logo, title, avatar */}
      <main className='flex w-full items-center gap-3 lg:hidden justify-between'>
        <MobileSidebar userRole={userRoleProp} />
        <Link
          href='/home'
          className='flex shrink-0 items-center gap-2 outline-none ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 rounded-md'
          aria-label='Job Hound home'
        >
          <Logo className='h-15 w-15 shrink-0' />
          {/* <span className='hidden font-semibold text-foreground text-sm tracking-tight sm:inline'>
            Job Hound
          </span> */}
        </Link>
        {/* <div className='min-w-0 flex-1'>
          <h1 className='truncate text-base font-semibold sm:text-lg'>{title}</h1>
          {subHeading ? (
            <p className='truncate text-xs text-muted-foreground'>{subHeading}</p>
          ) : null}
        </div> */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className='shrink-0 rounded-full outline-none ring-ring focus-visible:ring-2 focus-visible:ring-offset-2'
              aria-label='Account menu'
            >
              <Avatar className='h-8 w-8'>
                {user?.photo ? (
                  <AvatarImage src={user.photo} alt='' />
                ) : (
                  <AvatarFallback className='text-xs'>
                    {user?.firstName?.slice(0, 1)}
                    {user?.lastName?.slice(0, 1)}
                  </AvatarFallback>
                )}
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-56'>
            <div className='border-b px-2 py-2'>
              <p className='truncate text-sm font-medium'>{user?.firstName} {user?.lastName}</p>
              <p className='truncate text-xs text-muted-foreground'>{user?.email}</p>
            </div>
            <DropdownMenuItem asChild>
              <Link href='/settings'>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            {isLoading ? (
              <DropdownMenuItem disabled>Logging out…</DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => logout()} className='text-destructive focus:text-destructive'>
                Log out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </main>
    </nav>
  );
}
