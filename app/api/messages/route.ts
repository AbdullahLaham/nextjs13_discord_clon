import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";
import toast from "react-hot-toast";

export async function GET(req: Request) {
    let MESSAGES_BATCH = 10
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const channelId = searchParams.get('channelId');

        if (!profile) {
            throw new NextResponse("Unauthorized", { status: 401 })
        }
        if (!channelId) {
            throw new NextResponse("Channel ID Missing", { status: 400 })
        }
        
        let messages: Message[] = [];

        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
                // , orderBy: {
                //     createdAt: 'desc',
                // }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
                // , orderBy: {
                //     createdAt: 'desc',
                // }
            })
        }
        let nextCursor = null;
        if (messages.length === MESSAGES_BATCH) {
            // if we still not reached the last message from the messages
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }
    return NextResponse.json({ items: messages, nextCursor })


    } catch(error) {
        console.log("[MESSAGES_GET]", error);
        toast.error("error")
        return new NextResponse("internal error", { status: 500 })
    }
}