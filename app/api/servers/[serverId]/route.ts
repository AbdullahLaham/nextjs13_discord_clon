import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(req:Request, {params}: {params: {serverId: string}}) {
    try {
        const profile = await currentProfile();
        const {name, imageUrl} = await req.json();
        if (!profile) return new NextResponse("Unauthorized", {status: 401});
        if (!params.serverId) return new NextResponse("SERVER ID MISSING", {status: 400});
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                imageUrl,
                name
            }
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_PATCH]", error)
        return new NextResponse("internal error", {status: 500});
    }
}



export async function DELETE(req:Request, {params}: {params: {serverId: string}}) {
    try {
        const profile = await currentProfile();
        if (!profile) return new NextResponse("Unauthorized", {status: 401});
        if (!params.serverId) return new NextResponse("SERVER ID MISSING", {status: 400});
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
                members: {
                    some: {
                        profileId: profile?.id,
                        role: MemberRole.ADMIN || MemberRole.MODERATOR,
                    }
                }
            },
        })
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_DELETE]", error)
        return new NextResponse("internal error", {status: 500});
    }
}