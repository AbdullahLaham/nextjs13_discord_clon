import { NextApiRequest } from "next";
import { NextApiResponseServerIo } from "@/types";
import { currentProfile } from "@/lib/currentProfilePages";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export default async function Handler(req: NextApiRequest, res: NextApiResponseServerIo) {
    if (req.method !== 'PATCH' && req.method !== 'DELETE') {
        return res.status(405).json({error: "Method not allowed"})
    }
    try {
        const profile = await currentProfile(req);
        const {content} = req.body;
        const {serverId, channelId, messageId} = req.query;

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
        });

        if (!channel) return res.status(404).json({error: "Channel Not Found"});

        const member = await server.members.find((member) => member?.profileId == profile?.id);

        if (!member) return res.status(404).json({error: "Member Not Found"});
        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })

        if (!message || message?.deleted) {
            return res.status(404).json({message: "Message Not Found"})
        }

        const isMessageOwner = message?.memberId === member?.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isModerator || isAdmin ;

        if (!canModify) {
            return res.status(401).json({error: "Unauthorized"})
        }
        if (req.method == 'DELETE') {
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "this message has been deleted",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }



        if (req.method == 'PATCH') {
            if (!isMessageOwner) {
                return res.status(401).json({error: "Unauthorized"})
            }
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }



        const channelKey = `chat:${channelId}:messages:update`;
        res?.socket?.server?.io?.emit(channelKey, message);
        return res.status(200).json(message);


    } catch(error) {
        console.log("[MESSAGES_UPDATE]", error);
        return res.status(500).json({message: "internal error"})
    }
}


