import { Hash, Menu } from 'lucide-react'
import React from 'react'
import MobileToggle from '@/components/mobile-toggle'
import { Profile, Server } from '@prisma/client'
import { safeServer } from '@/types'
import UserAvatar from '../UserAvatar'
interface ChatHeaderProps {
    serverId: string,
    name: string,
    servers: Server[],
    server: safeServer,
    profile: Profile,
    type: "channel" | "conversation",
    imageUrl?: string,

}
const ChatHeader = ({serverId, name, imageUrl, type, profile, servers, server}: ChatHeaderProps) => {

  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
        <MobileToggle servers={servers}  profile={profile} server={server} />

        {type == "channel" && (
            <Hash className='w-5 h-5 text-zinc-700 dark:text-zinc-400 mr-2' />
        )}
        {type == "conversation" && (
            <UserAvatar src={imageUrl} className='w-10 h-10 mr-2 ' />
        )}

        <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
    </div>
  )

}

export default ChatHeader