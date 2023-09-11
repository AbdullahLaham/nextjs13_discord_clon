import { currentProfile } from '@/lib/currentProfile'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react'
import NavigationAction from './NavigationAction';

const NavigationSidebar = async () => {
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
    <div className='space-y-[5rem] flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] '>
        <NavigationAction />
    </div>
  )
}

export default NavigationSidebar