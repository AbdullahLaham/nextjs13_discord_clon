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
    const member = await db.member.findFirst({
        where: {
            profileId: profile.id,
            serverId: params.serverId,
        }
    })
    if (!channel || !member) {
        redirect('/');
    }
  return (
    <div>
        channel
    </div>
  )
}

export default ChannelPage