'use client'

import { safeServer } from '@/types'
import { MemberRole } from '@prisma/client'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { Server } from 'http'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, Users } from 'lucide-react'
import React from 'react'
import { DropdownMenuSeparator } from '../ui/dropdown-menu'
import { useModal } from '@/hooks/useModalStore'
interface ServerHeaderProps {
    server: safeServer,
    role?: string
}
const ServerHeader: React.FC<ServerHeaderProps> = ({server, role}) => {
    const {onOpen} = useModal();
    const isAdmin = role == MemberRole.ADMIN;
    const isModerator = isAdmin || role == MemberRole.MODERATOR;

  return (
    <DropdownMenu>
        <DropdownMenuTrigger className='focus:outline-none' >
            <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50'>
                {server.name}
                <ChevronDown className='w-5 h-5 ml-auto' />
            </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] '>
            {isModerator && (
                <DropdownMenuItem onClick={() => onOpen("invite", {server})} className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'>Invite People</DropdownMenuItem>
            )}
            {
                isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen('editServer', {server})} className=' px-3 py-2 text-sm cursor-pointer flex items-center'>Server Settings <Settings className='h-4 w-4 ml-auto' /></DropdownMenuItem>
                )
            }
            {
                isAdmin && (
                    <DropdownMenuItem onClick={() => onOpen('members', {server})} className=' px-3 py-2 text-sm cursor-pointer flex items-center'>Manage Members<Users className='h-4 w-4 ml-auto' /></DropdownMenuItem>
                )
            }
            {
                isModerator && (
                    <DropdownMenuItem className=' px-3 py-2 text-sm cursor-pointer flex items-center'>Create Channel <PlusCircle className='h-4 w-4 ml-auto' /></DropdownMenuItem>
                )
            }
            {
                isModerator && (
                    <DropdownMenuSeparator />
                )
            }
            {
                isAdmin && (
                    <DropdownMenuItem className=' px-3 py-2 text-sm cursor-pointer text-rose-500 flex items-center '>Delete Server <Trash className='h-4 w-4 ml-auto' /></DropdownMenuItem>
                )
            }
            {
                !isAdmin && (
                    <DropdownMenuItem className=' px-3 py-2 text-sm cursor-pointer text-rose-500 flex items-center '>Leave Server <LogOut className='h-4 w-4 ml-auto' /></DropdownMenuItem>
                )
            }
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader