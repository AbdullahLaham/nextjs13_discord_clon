import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { currentProfile } from '@/lib/currentProfile'
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/dist/server/api-utils';
import React from 'react'
interface ChannelPageProps {
    params: {
        serverId: string,
        channelId: string,
    }
}
const ChannelPage = async ({params}: ChannelPageProps) => {
    const profile = await currentProfile();
    if (!profile) return redirectToSignIn();
    const channel = await db.channel.findUnique({
        where: {
            id: params?.channelId,
        }
    });
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        }
      })

    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: params.serverId,
        }
    })
    const server = await db.server.findUnique({
        where: {
            id: params.serverId
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "desc",
                }
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: 'asc',
                }
            }
        }
    })
    if (!channel || !member || !server) {
        return redirect('/');
    }
  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
        <ChatHeader type='channel' name={channel?.name} serverId={params?.serverId} servers={servers} profile={profile} server={server}  />
        <div className='flex-1'>
            <ChatMessages member={member} type='channel' name={channel?.name} chatId={channel?.id} apiUrl='/api/messages' socketUrl='/api/socket/messages' socketQuery={{serverId: server?.id, channelId: channel?.id}} paramKey='channelId' paramValue={channel?.id} />
        </div>
        <ChatInput name={channel.name} type='channel' apiUrl='/api/socket/messages' query={{channelId: channel?.id, serverId: server?.id}} />
    </div>
  )
}

export default ChannelPage