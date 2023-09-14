'use client'


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { useModal } from '@/hooks/useModalStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw, ShieldAlert, ShieldCheck } from "lucide-react";

import axios from "axios";
import { safeServer } from "@/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Member } from "@prisma/client";
import UserAvatar from "@/components/UserAvatar";

const ManageMembersModal = () => {
    const router = useRouter();
    const [loadingId, setIsLoading] = useState("");
    const {onOpen, isOpen, onClose, type, data} = useModal();
    const {server} = data as {server: safeServer};

    const isModalOpen = isOpen && type == "members";
   
    const roleIconMap = {
        "GUEST": null,
        "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500 " />,
        "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500 " />,

    }
    
  return (
   <div>
        <Dialog open = {isModalOpen} onOpenChange={onClose}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="bg-white text-black overflow-hidden">
                <DialogHeader className="pt-8 px-6 ">
                    <DialogTitle className="text-2xl text-center font-semibold">Invite Friends</DialogTitle>
                    <DialogDescription className="text-zinc-500 text-center">
                        {server?.members?.length} Members
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea>
                    {server?.members.map((member: Member) => {
                        return (
                            <div key={member.id} className="flex items-center gap-x-2 mb-6  ">
                                <UserAvatar className="" src={member?.profile?.imageUrl} />
                                <div className="flex flex-col gap-y-1">
                                    <div className="text-xs font-semibold flex items-center gap-x-1 ">
                                        {member?.profile?.name}
                                        {roleIconMap[member?.role]}
                                    </div>
                                    <div className="text-xs font-semibold text-zinc-500  ">
                                        {member?.profile?.email}
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </ScrollArea>
                <div className="p-6">
                    Hello members
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default ManageMembersModal