// import { currentProfile } from "@/lib/currentProfile";
// import { db } from "@/lib/db";
// import { DirectMessage, Message } from "@prisma/client";
// import { NextResponse } from "next/server";
// import toast from "react-hot-toast";

// export async function GET(req: Request) {
//     let MESSAGES_BATCH = 10;
//     try {
//         const profile = await currentProfile();
//         const { searchParams } = new URL(req.url);
//         const cursor = searchParams.get("cursor");
//         const conversationId = searchParams.get('conversationId');

//         if (!profile) {
//             throw new NextResponse("Unauthorized", { status: 401 })
//         }
//         if (!conversationId) {
//             throw new NextResponse("Conversation ID Missing", { status: 400 })
//         }
        
//         let messages: DirectMessage[] = [];

//         if (cursor) {
//             messages = await db.directMessage.findMany({
//                 take: MESSAGES_BATCH,
//                 skip: 1,
//                 cursor: {
//                     id: cursor,
//                 },
//                 where: {
//                     conversationId
//                 },
//                 include: {
//                     member: {
//                         include: {
//                             profile: true
//                         }
//                     }
//                 }
//                 , orderBy: {
//                     createdAt: 'desc',
//                 }
//             })
//         } else {
//             messages = await db.directMessage.findMany({
//                 take: MESSAGES_BATCH,
//                 where: {
//                     conversationId,
//                 },
//                 include: {
//                     member: {
//                         include: {
//                             profile: true
//                         }
//                     }
//                 }
//                 , orderBy: {
//                     createdAt: 'desc',
//                 }
//             })
//         }
//         let nextCursor = null;
//         if (messages.length === MESSAGES_BATCH) {
//             // if we still not reached the last message from the messages
//             nextCursor = messages[MESSAGES_BATCH - 1].id;
//         }
//     return NextResponse.json({ items: messages, nextCursor })


//     } catch(error) {
//         console.log("[DIRECT_MESSAGES_GET]", error);
//         toast.error("error")
//         return new NextResponse("internal error", { status: 500 })
//     }
// }






















import { NextResponse } from "next/server";
import { DirectMessage } from "@prisma/client";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";

const MESSAGES_BATCH = 10;

export async function GET (
  req: Request
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    if (!conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      })
    } else {
      messages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.log("[DIRECT_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}