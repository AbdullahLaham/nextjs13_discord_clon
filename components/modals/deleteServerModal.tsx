'use client'


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import { useModal } from '@/hooks/useModalStore';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const DeleteServerModal = () => {
    const router = useRouter();

    const {onOpen, isOpen, onClose, type, data} = useModal();
    const {server} = data;
    const [isLoading, setIsLoading] = useState(false);
    const isModalOpen = isOpen && type == "deleteServer";
   
    const deleteServer = async () => {
        setIsLoading(true);

        try {
            await axios.delete(`/api/servers/${server?.id}`);
            onClose();
            toast.success("server Seleted successfully")
            router.push('/');
            router.refresh();
            

        } catch(error) {
            console.log(error);
            toast.error('something went wrong')
        }
    }
  return (
   <div>
        <Dialog open = {isModalOpen} onOpenChange={onClose}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6 ">
                    <DialogTitle className="text-2xl text-center font-semibold">Delete Server</DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 ">
                        Are you sure you want to delete <span className="font-semibold text-indigo-500">{server?.name}</span> server <br />
                        the server will permanently be deleted
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4 ">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} onClick={() => onClose()} variant={'ghost'}>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={() => deleteServer()} variant={'primary'}>
                            Delete
                        </Button>

                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default DeleteServerModal