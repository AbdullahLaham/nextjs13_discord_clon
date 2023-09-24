"use client"



import { Member, Message, Profile } from '@prisma/client'
import React, { Fragment } from 'react'
import ChatWelcome from './ChatWelcome'
import { useChatQuery } from '@/hooks/useChatQuery'
import { Loader2, ServerCrash } from 'lucide-react'

interface ChatMessagesProps {
    name: string,
    member: Member,
    chatId: string,
    apiUrl: string,
    socketUrl: string,
    socketQuery: Record<string, string>,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
    type: "channel" | "conversation"

}


const ChatMessages = ({
    name,
    member,
    chatId,
    apiUrl,
    socketUrl,
    socketQuery,
    paramKey,
    paramValue,
    type,
  }: ChatMessagesProps) => {
    type MessageWithMemberWithProfile = Message & {
        member: Member & {
            profile: Profile
        }
    }
    const queryKey = `chat:${chatId}`;
    
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status}: any = useChatQuery({apiUrl, paramKey, paramValue, queryKey })
    console.log(data, 'daaaaaaaaaaaaaa')
    if (status == 'loading') {
        return (
            <div className='flex flex-col flex-1 h-full justify-center items-center'>
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                    Loadign Messages...
                </p>
            </div>
        )
    }
    if (status == 'error') {
        return (
            <div className='flex flex-col flex-1 h-full justify-center items-center'>
                <ServerCrash className='h-7 w-7 text-zinc-500  my-4' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400'>
                    Something Went Wrong...
                </p>
            </div>
        )
    }
    return (
    <div className='flex-1 h-full flex flex-col py-4 overflow-y-auto'>
        <div className='flex-1' />
        <ChatWelcome type={type} name={name} />
        <div className='flex flex-col-reverse mt-auto'>
            {data?.pages?.map((group: any, i: number) => (
                <Fragment>
                    {group?.items?.map((message: MessageWithMemberWithProfile, i: number) => (
                        <div key={i}>
                            {message?.content}
                        </div>
                    ))}
                </Fragment>
            ))}

        </div>
    </div>
  )
}

export default ChatMessages
