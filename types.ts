import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import {Server as SocketIOServer} from "socket.io";

import { Channel, Member, Profile, Server } from "@prisma/client";

export type safeServer = Server & {members: (Member & {profile: Profile})[]} & {channels: (Channel)[]}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer,
        }
    }
}
