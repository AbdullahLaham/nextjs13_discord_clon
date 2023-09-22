'use client'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import qs from 'query-string';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import React, { use, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from 'next/navigation'
import { useModal } from '@/hooks/useModalStore'
import { ChannelType } from '@prisma/client'
import toast from 'react-hot-toast';

const EditChannelModal = () => {
    const router = useRouter();

    const {isOpen, onClose, type, data} = useModal();
    
    const {channelType, channel, server} = data;
    
    const isModalOpen = isOpen && type == "editChannel";

    const formSchema = z.object({
        name: z.string().min(2, {
            message: "Channel name is required.",
        }).refine((name) => name !== 'general', {
            message: 'Channel name cannot be "general"'
        }), 
        type: z.nativeEnum(ChannelType),
    });

    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: channel?.name ,
            type: channel?.type || ChannelType.TEXT,
        }
    });
    useEffect(() => {
        channel?.type && form.setValue('type', channel?.type)
        channel?.name &&  form.setValue('name', channel?.name)
    }, [form])
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: `/api/channels/${channel?.id}`,
                query: {
                    serverId: server?.id,
                }
            })
            await axios.patch(url, values);
            form.reset();
            toast.success("Channel updated Successfully")
            router.refresh();
            onClose();
            window.location.reload();

        } catch(error) {
            console.log(error);
            toast.error('something went wrong')
        }
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }
  return (
    <div>
        <Dialog open = {isModalOpen} onOpenChange={handleClose}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6 ">
                <DialogTitle className="text-2xl text-center font-semibold">Edit Channel </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6 ">
                            
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel name</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} {...field} className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0  ' placeholder='Enter Channel Name' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Channel name</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading} className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0  ' placeholder='Enter Channel Name' {...field} >
                                                <FormControl>
                                                    <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none' >
                                                        <SelectValue placeholder="Select the Channel Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                
                                                {
                                                    Object.values(ChannelType).map((type) => {
                                                        return (
                                                            <SelectItem className='capitalize' key={type} value={type}>{type.toLowerCase()}</SelectItem>
                                                        )
                                                    })
                                                }
                                                </SelectContent>
                                            </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormMessage />

                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4 ">
                            <Button type='submit' disabled={isLoading} variant={'primary'} >Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
                
            </DialogContent>
        </Dialog>
    </div>
  )
}


export default EditChannelModal