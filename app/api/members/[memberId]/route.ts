import { currentProfile } from "@/lib/currentProfile";
import {db} from '@/lib/db';
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';

export async function PATCH (req: Request, {params}: {params:{ memberId: string}}) {
    try {
        const {role} = await req.json();
        const {memberId} = params;
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const profile = await currentProfile();


        if (!profile) {
            throw new NextResponse("Unauthorized", { status: 401 })
        }
        if (!serverId) {
            throw new NextResponse("Server ID Missing", { status: 400 })
        }
        if (!params?.memberId) {
            throw new NextResponse("Member ID Missing", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile?.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params?.memberId,
                            profileId: {
                                not: profile?.id,
                            }
                        },
                        data: {
                            role,
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc',
                    }
                }
            }
        });
        
        return NextResponse.json(server);
        
    } catch(error) {
        console.log("[MEMBERS_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}







export async function DELETE (req: Request, {params}: {params:{ memberId: string}}) {
    try {
        const {memberId} = params;
        const {searchParams} = new URL(req.url);
        const serverId = searchParams.get('serverId');
        const profile = await currentProfile();


        if (!profile) {
            throw new NextResponse("Unauthorized", { status: 401 })
        }
        if (!serverId) {
            throw new NextResponse("Server ID Missing", { status: 400 })
        }
        if (!params?.memberId) {
            throw new NextResponse("Member ID Missing", { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile?.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: params?.memberId,
                        profileId: {
                            not: profile?.id,
                        }
                    }
                },

            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: 'asc',
                    }
                }
            }

        });
        
        return NextResponse.json(server);
        
    } catch(error) {
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}