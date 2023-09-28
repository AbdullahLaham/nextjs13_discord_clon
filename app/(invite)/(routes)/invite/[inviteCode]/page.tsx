import { currentProfile } from '@/lib/currentProfile'
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { AwardIcon } from 'lucide-react'
import { redirect } from 'next/navigation';
import React from 'react'

const InviteCodePage = async ({params}: {params: {inviteCode: string}}) => {
    const profile = await currentProfile();

    if (!profile && process.env.NODE_ENV == 'production') return redirectToSignIn();
    if (!profile) return redirectToSignIn();
    if (!params.inviteCode) return redirect("/");
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params?.inviteCode,
            members: {
                some: {
                    profileId: profile?.id,
                }
            }
        }
    });
    if (existingServer) return redirect(`/servers/${existingServer?.id}`);
    const server = await db.server.update({
        where: {
            inviteCode:params?.inviteCode
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile?.id,
                    }
                ]
            }
        }
    })
    if (server) return redirect(`/servers/${server?.id}`)
  return null;
}

export default InviteCodePage