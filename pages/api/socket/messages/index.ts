import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfile } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";

export default async function Handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== 'POST') {
        return res.status(405).json({error: "Method not allowed"})
    }
    try {
        const profile = await currentProfile(req);
        const {content, fileUrl} = req.body;
        const {serverId, channelId} = req.query;
        if (!profile) return res.status(401).json({error: "unauthorized"});
        if (!serverId) {
            return res.status(401).json({error: "Server ID Missing"})
        }
        if (!channelId) {
            return res.status(401).json({error: "Channel ID Missing"})
        }

        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile?.id
                    }
                }
            },
            include: {
                members: true,
            }
        });
        if (!server) return res.status(404).json({error: "Server Not Found"});
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        })
        if (!channel) return res.status(404).json({error: "Channel Not Found"});

        const member = await server.members.find((member) => member?.profileId == profile?.id);

        if (!member) return res.status(404).json({error: "Member Not Found"});


        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member?.id,
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${channelId}:messages`;
        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);

    } catch(error) {
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({message: "internal error"})
    }
}


