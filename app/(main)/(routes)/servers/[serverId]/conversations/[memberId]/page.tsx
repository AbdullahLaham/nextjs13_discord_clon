import MediaRoom from '@/components/MediaRoom';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessages from '@/components/chat/ChatMessages';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/currentProfile'
import { db } from '@/lib/db';
import { safeServer } from '@/types';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'
interface MemberPageProps {
  params: {
    memberId: string,
    serverId: string,
  },
  searchParams: {
    video?: boolean
  }
}
const MemberPage = async ({ params, searchParams }: MemberPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

//End  Data Fetching for sidebar

  const servers = await db.server.findMany({
    where: {
        members: {
            some: {
                profileId: profile.id,
            }
        }
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



//End  Data Fetching for sidebar

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(currentMember.id, params.memberId);
  
  
  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;



  return (
    <div className='bg-white flex flex-col h-full dark:bg-[#34373b]'>
      <ChatHeader name={otherMember.profile.name} imageUrl={otherMember.profile.imageUrl} type='conversation'  servers={servers} server={server} profile={profile} serverId={params?.serverId}   />

      {!searchParams.video ? (
        <>
          <ChatMessages member={currentMember} name={otherMember?.profile?.name} chatId={conversation?.id} type='conversation' apiUrl='/api/direct-messages' paramKey='conversationId' paramValue={conversation?.id} socketUrl={'/api/socket/direct-messages'} socketQuery={{conversationId: conversation?.id, }}   />
          <ChatInput name={otherMember?.profile?.name} apiUrl='/api/socket/direct-messages' type='conversation'  query={{conversationId: conversation?.id, }}  />
        </>
      ): <MediaRoom chatId={conversation?.id} video={true} audio={true} />}
      
    </div>
  )
}

export default MemberPage; 
