'use client'

import { currentProfile } from '@/lib/currentProfile'
import { db } from '@/lib/db';
import { Channel, ChannelType, Profile } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'
import ServerHeader from './ServerHeader';
import { safeServer } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServerSidebarProps {
    serverId: string,
    server: safeServer,
    profile: Profile,
}

const ServerSidebar = ({serverId, server, profile}: ServerSidebarProps) => {
    
    const textChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel: Channel) => channel.type === ChannelType.VIDEO);

    const members = server?.members?.filter((member) => member?.profileId !== profile.id);

    if (!server) return redirect('/');

    const role = server.members.find((member) => member.profileId === profile.id)?.role;
  return (
    <div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F4]'>
        <ServerHeader server={server} role={role} />
        <ScrollArea className='flex-1 px-3' >
          <ServerSearch />
        </ScrollArea>
    </div>
  )
}

export default ServerSidebar;
