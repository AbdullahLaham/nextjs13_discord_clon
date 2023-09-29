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
        const {directMessageId, conversationId} = req.query;

        if (!profile) return res.status(401).json({error: "unauthorized"});



        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                      memberOne: {
                        profileId: profile.id,
                      }
                    },
                    {
                      memberTwo: {
                        profileId: profile.id,
                      }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true 
                    }
                },
                memberTwo: {
                    include: {
                        profile: true 
                    }
                },
            }

        })

        const member = conversation?.memberOne?.profileId === profile.id ? conversation?.memberOne : conversation?.memberTwo

        if (!member) return res.status(404).json({error: "Member Not Found"});


        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string,
            
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        })
        
        if (!directMessage || directMessage?.deleted) {
            return res.status(404).json({message: "Message Not Found"})
        }



        const isMessageOwner = directMessage?.memberId === member?.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isModerator || isAdmin ;

        if (!canModify) {
            return res.status(401).json({error: "Unauthorized"})
        }

        

        


        if (req.method == 'DELETE') {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
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
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
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



        const updateKey = `chat:${conversationId}:messages:update`;
        res?.socket?.server?.io?.emit(updateKey, directMessage);
        return res.status(200).json(directMessage);


    } catch(error) {
        console.log("[DIRECT_MESSAGES_UPDATE]", error);
        return res.status(500).json({message: "internal error"});
    }
}


