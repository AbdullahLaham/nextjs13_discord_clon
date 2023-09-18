'use client'

import { cn } from '@/lib/utils'
import { safeServer } from '@/types'
import { Channel, ChannelType, MemberRole, Server, Member, } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import ActionTooltip from '../ActionTooltip'
import { ShieldAlert, ShieldCheck } from 'lucide-react'

interface ServerChannelProps {
    member: Member,
    server: Server,
    role?: MemberRole,
}

const iconMap = {
    [MemberRole.ADMIN]: <ShieldAlert className='flex-shrink-0 h-5 w-5 text-rose-500' />,
    [MemberRole.MODERATOR]: <ShieldCheck className='flex-shrink-0 h-5 w-5 text-indigo-500' />,
    [MemberRole.GUEST]: null,
  
  }
  
const ServerMember = ({member, server, role}: ServerChannelProps) => {
    const params = useParams();
    const Icon = iconMap[member.role];
  return (
    <button onClick={() => {}} className={cn('group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1', params?.memberId == member.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
        {Icon}
        <p className={cn(
        "line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
        params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
      )}>{member?.profile?.name}</p>
      {role !== MemberRole.GUEST && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip label='Edit'>
            <Edit className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-400' />
          </ActionTooltip>
          <ActionTooltip label='Delete'>
            <Trash className='hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition' />
          </ActionTooltip>

        </div>
      )}
      {
        member.profile.name == 'general' && (
          <Lock className=' w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-400' /> 
        )
      }
    </button>
  )
}

export default ServerMember