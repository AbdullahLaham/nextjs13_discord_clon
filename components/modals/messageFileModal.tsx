'use client'
import axios from 'axios'
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
  } from "@/components/ui/form"

import React from 'react'
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import FileUpload from "@/components/FileUpload"
import { useRouter } from 'next/navigation'
import useOrigin from '@/hooks/useOrigin'
import { useModal } from '@/hooks/useModalStore'
import qs from 'query-string';

const MessageFileModal = () => {
    
    const router = useRouter();

    const {isOpen, onClose, type, data } = useModal();
    const {apiUrl, query} = data;

    const isModalOpen = isOpen && type == 'messageFile';



    const formSchema = z.object({
        fileUrl: z.string().min(2, {
            message: "Attachment is required.",
        }),
    });

    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: "",
        }
    });
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query,
            })
            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });

            form.reset();
            router.refresh();
            handleClose();

        } catch(error) {
            console.log(error);
        }
    }
    const handleClose = () => {
        form.reset();
        onClose();
    }
  return (
    <div>
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6 ">
                <DialogTitle className="text-2xl text-center font-semibold">Add an attachment</DialogTitle>
                <DialogDescription>
                    Send a file as a message
                </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6 ">
                            <div className="flex items-center justify-center text-center ">
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({field}) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
                                            </FormControl>

                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4 w-[100%]">
                            <Button type='submit' disabled={isLoading} variant={'primary'} >Send</Button>
                        </DialogFooter>
                    </form>
                </Form>
                
            </DialogContent>
        </Dialog>
    </div>
  )
}

export default MessageFileModal
