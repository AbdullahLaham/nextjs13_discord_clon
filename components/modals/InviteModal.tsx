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
import { Check, Copy, RefreshCw } from "lucide-react";
import useOrigin from "@/hooks/useOrigin";
import axios from "axios";

const InviteModal = () => {
    const router = useRouter();

    const {onOpen, isOpen, onClose, type, data} = useModal();
    const origin = useOrigin();
    const {server} = data;
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;
    const isModalOpen = isOpen && type == "invite";
    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => setCopied(false), 1000);
    }
    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);
            onOpen("invite", {server: response.data});
            setIsLoading(false);
        } catch (error) {
            console.log(error)
        } finally {

        }
    }
  return (
   <div>
        <Dialog open = {isModalOpen} onOpenChange={onClose}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6 ">
                    <DialogTitle className="text-2xl text-center font-semibold">Invite Friends</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Invite Link</Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 " disabled={isLoading} value={inviteUrl} />
                        <Button disabled={isLoading} size={"icon"} onClick={onCopy} >
                            {!copied ? <Copy className="h-4 w-4" />: <Check className="w-4 h-4" />}
                        </Button>
                    </div>
                    <Button onClick={onNew} disabled={isLoading} className="w-full mt-2 text-xs text-zinc-500 " >
                        Create A New Link
                        <RefreshCw className="w-4 h-4 ml-2 " />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default InviteModal