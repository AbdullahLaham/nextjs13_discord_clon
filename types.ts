import { Channel, Member, Profile, Server } from "@prisma/client";

export type safeServer = Server & {members: (Member & {profile: Profile})[]} & {channels: (Channel)[]}