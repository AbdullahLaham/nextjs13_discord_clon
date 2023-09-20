

import ClientOnly from '@/components/ClientOnly';
import InitialModal from '@/components/modals/InitialModal';
import CreateServerModal from '@/components/modals/createServerModal';
import NavigationSidebar from '@/components/navigation/NavigationSidebar';
import { currentProfile } from '@/lib/currentProfile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Toaster } from "react-hot-toast";
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
    <ClientOnly>
      <Toaster />
        <div className='hidden md:flex h-full w-[4.5rem] z-30 flex-col fixed inset-y-0'>
            <NavigationSidebar servers={servers} profile={profile} />
        </div>
        <main className='md:pl-[4.5rem] h-full '>
            {children}
        </main>
    </ClientOnly>
  )
}

export default MainLayout ;