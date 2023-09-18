import { safeServer } from '@/types'
import { ChannelType, MemberRole } from '@prisma/client'
import React from 'react'
import ActionTooltip from '../ActionTooltip'
import { Plus, Settings } from 'lucide-react'
import { useModal } from '@/hooks/useModalStore'



interface ServerSectionProps {
    label: string,
    role?: MemberRole,
    sectionType: "channels" | "members",
    channelType?: ChannelType,
    server?: safeServer,
}

const ServerSection = ({ label, role, sectionType, channelType, server }: ServerSectionProps) => {
    const {onOpen} = useModal();

  return (
    <div className='flex items-center justify-between py-2 '>
        <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
            {label}
        </p>
        {
            role == MemberRole.ADMIN && sectionType === 'members' && (
                <ActionTooltip label='Create Channel' side='top'>
                    <button onClick={() => onOpen("members", {server})} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300 transition ' >
                        <Settings className='h-4 w-4'/> 
                    </button>
                </ActionTooltip>
            )
        }
        {
            role !== MemberRole.GUEST && sectionType === 'channels' && (
                <ActionTooltip label='create Channel' side='top'> 
                    <button onClick={() => onOpen("createChannel", {server, channelType})} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 hover:dark:text-zinc-300 transition ' >
                        <Plus className='h-4 w-4'/>
                    </button>
                </ActionTooltip>
            )
        }
    </div>
  )
}

export default ServerSection