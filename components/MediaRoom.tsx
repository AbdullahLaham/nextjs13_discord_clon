"use client"



import React, {useEffect, useState} from 'react'
import {
    LiveKitRoom,
    VideoConference,
    GridLayout,
    ParticipantTile,
    ControlBar,
    RoomAudioRenderer,
    
  }
   from '@livekit/components-react';
  import "@livekit/components-styles";
  import { Channel } from '@prisma/client';
import { useUser } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
interface MediaRoomProps {
    chatId: string,
    video: boolean,
    audio: boolean
}
const MediaRoom = ({chatId, video, audio}: MediaRoomProps) => {
    const {user} = useUser();
    const [token, setToken] = useState("");
    useEffect(() => {
        if (!user?.firstName || !user?.lastName ) return;
        const name = `${user?.firstName} ${user?.lastName}`;
        (async () => {
            try {
              const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`);
              const data = await resp.json();
              setToken(data.token);
                // setToken(data?.token)

            } catch (error) {
                console.error(error);
            }
        })();
    }, [user?.firstName, user?.lastName, chatId]);
    if (token === "") {
        return (
            <div className='flex flex-col flex-1 justify-center items-center '>
                <Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4 ' />
                <p className='text-xs text-zinc-500 dark:text-zinc-400 '>Loading...</p>
            </div>
        );
      }
  return (
    <LiveKitRoom
      video={video}
      audio={audio}
      token={token}
      connect={true}
      connectOptions={{ autoSubscribe: false }}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      // Use the default LiveKit theme for nice styles.
      data-lk-theme="default"
      style={{ height: '100dvh', overflowY: 'auto' }}
    >
      {/* Your custom component with basic video conferencing functionality. */}
      {video && <VideoConference />}
      {/* The RoomAudioRenderer takes care of room-wide audio for you. */}
      {(audio || video) && <RoomAudioRenderer />}
      {/* Controls for the user to start/stop audio, video, and screen 
      share tracks and to leave the room. */}
    </LiveKitRoom>
  )
}

export default MediaRoom
