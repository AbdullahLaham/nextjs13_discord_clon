"use client"
import * as z from 'zod';
import axios from 'axios';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import qs from 'query-string';
  import {useForm} from 'react-hook-form';
  import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { Member, MemberRole, Profile } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import UserAvatar from '../UserAvatar'
import { Delete, Edit, FileIcon, ShieldAlert, ShieldCheck } from 'lucide-react'
import ActionTooltip from '../ActionTooltip'
import Image from 'next/image'
import { cn } from '@/lib/utils'


interface ChatItemProps {
    id: string,
    content?: string,
    member: Member & {
        profile: Profile
    },
    timestamp: string,
    fileUrl: string | null,
    deleted: boolean,
    currentMember: Member,
    isUpdated: boolean,
    socketUrl: string,
    socketQuery: Record<string, string>,

}
const ChatItem = ({ id, content, member, timestamp, fileUrl, deleted, currentMember, isUpdated, socketUrl, socketQuery }: ChatItemProps) => {
    const roleIconMap = {
        "GUEST": null,
        "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500 " />,
        "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500 " />,

    }

    const formSchema = z.object({
        content: z.string().min(1, {
            message: "Content is required.",
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: content,
        }
    });

    const onSubmit = (values) => {
        console.log(values)
    }
    useEffect(() => {
        const handleKeyDown = (event: any) => {
            if (event.key === 'Escape' || event.keyCode == 27) {
                setIsEditing(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        form.reset({
            content: content,
        })
    }, [content]);

    const fileType = fileUrl?.split('.').pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR;
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPDF = fileType === "pdf" && fileUrl;
    const isImage = !isPDF && fileUrl; 

    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);


    return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full '>
        <div className='group flex gap-x-2 items-center w-full '>
            <div className='cursor-pointer hover:drop-shadow-md transition'>
                <UserAvatar src={member?.profile?.imageUrl} />
            </div>
            <div className='flex flex-col w-full'>
                <div className='flex items-center gap-x-2 '>
                    <div className='flex items-center gap-x-2'>
                        <p className='font-semibold text-sm hover:underline cursor-pointer'>
                            {member?.profile?.name}
                        </p>
                        <ActionTooltip label={member?.role} >
                            {roleIconMap[member?.role]}
                        </ActionTooltip>

                    </div>
                    <span className='text-xs text-zinc-500 dark:text-zinc-400 '>
                        {timestamp}
                    </span>
                
                </div>
                {isImage && (
                    <a href={fileUrl} target='_blank' rel='noopener noreferrer' className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'>
                        <Image src={fileUrl} alt={content} fill className='object-cover' />
                    </a>
                )}
                {isPDF && (
                    <a href={fileUrl} target='_blank' rel='noopener noreferrer' className='relative aspect-auto rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-auto w-48'>
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10 ">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline">PDF File</a>
                        </div>
                    </a>
                )}
                
                {!fileUrl && !isEditing && (
                    <p className={cn("text-sm text-zinc-600 dark:text-zinc-300 ", deleted && "italic text-zinc-500 dark:text-zinc-400 text-xs mt-1", )}>
                        {content}
                        {isUpdated && !deleted && (
                            <span className='mx-2 text-[10px] text-zinc-500 dark:text-zinc-200'>
                                (edited)
                            </span>
                        )}
                    </p>
                )}

                {!fileUrl && isEditing && (
                    <Form {...form}>
                        <form className='flex items-center w-full gap-x-2 pt-2 ' onSubmit={(values) => form.handleSubmit(onSubmit)} >
                            <FormField
                                control={form.control}
                                name='content'
                                render={({ field }) => (
                                    <FormItem className='flex-1'>
                                        <FormControl>
                                            <div className='relative p-4 px-6 '>
                                                <Input className='px-14 bg-zinc-200 dark:bg-zinc-600 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0  ' placeholder={`Editted Message`} {...field} />
                                            </div>         
                                        </FormControl>
                                    </FormItem>
                                )}
                             />
                             <Button size='sm' variant={'primary'}>
                                Save
                             </Button>
                        </form>
                        <span className='text-[10px] mt-1 text-zinc-400 '>
                            press escape to cancel, enter to save
                        </span>

                    </Form>
                )}


            </div>


        </div>
        {canDeleteMessage && (
            <div className='hidden group-hover:flex items-center gap-x-2 absolute right-5 top-2 p-1 bg-white dark:bg-zinc-800 rounded-md border '>
                
                {canEditMessage && (
                    <ActionTooltip label='Edit'>
                        <Edit onClick={() => setIsEditing(true)} className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 w-4 h-4 cursor-pointer ml-auto ' />
                    </ActionTooltip>
                )}

                <ActionTooltip label='Delete'>
                    <Delete className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 w-4 h-4 cursor-pointer ml-auto '  />
                </ActionTooltip>
            </div>
        )}

      
    </div>
  )
}

export default ChatItem
