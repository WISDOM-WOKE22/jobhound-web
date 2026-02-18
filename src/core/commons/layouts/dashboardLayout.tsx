'use client';

import NavBar from '../navigation/navigation';
import { SocketEvents } from '@/core/events';
import { useMainStore } from '@/lib/zustand/store';

export default function DashboardLayout({
  children,
  pageTitle,
  subHeading,
}: {
  children: React.ReactNode;
  pageTitle: string;
  subHeading?: string;
}) {
  const { user } = useMainStore();
  return (
    <main className='w-full lg:overflow-x-hidden'>
      <NavBar title={pageTitle} subHeading={subHeading} />
      <div className='pl-[25px] max-[500px]:px-[10px] md:pl-[260px] pt-[75px] pr-[25px] pb-[25px]'>
        {children}
      </div>
      {user && <SocketEvents/>}
    </main>
  );
}
