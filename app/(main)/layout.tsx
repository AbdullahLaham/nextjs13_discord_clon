

import NavigationSidebar from '@/components/navigation/NavigationSidebar';
import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'

const MainLayout = async ({children}: {children: React.ReactNode}) => {

  const profile = await currentProfile();
  
  if (!profile) {
    return redirect("/");
  }

  const servers = await db.server.findMany({
    where: {
        members: {
            some: {
                profileId: profile.id,
            }
        }
    }
  })
  return (
    <div className='h-full '>
        <div className='hidden md:flex h-full w-[4rem] z-30 flex-col fixed inset-y-0'>
            <NavigationSidebar />
        </div>
        <main className='md:pl-[4rem] h-full '>
            {children}
        </main>
    </div>
  )
}

export default MainLayout ;