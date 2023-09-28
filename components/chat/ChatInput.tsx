"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Input } from '../ui/input'
import { Plus, Smile } from 'lucide-react'
import qs from 'query-string'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useModal } from '@/hooks/useModalStore'
import EmojiPicker from '../EmojiPicker'
import { useRouter } from 'next/navigation'
interface ChatInputProps {
    apiUrl: string,
    query: Record<string, any>,
    name: string,
    type: "conversation" | "channel",
}
const formSchema = z.object({
    content: z.string().min(1),
})
const ChatInput = ({apiUrl, query, name, type}: ChatInputProps) => {

    const {onOpen} = useModal();
    const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        content: '',
    }
  });

  const isLoading = form.formState.isSubmitting;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {

        const url = qs.stringifyUrl({
            url: apiUrl,
            query,
        });

        await axios.post(url, values);
        form.reset();

    } catch (error) {
        toast.error(error.message);
    }
  }
  return (
    <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <div className='relative p-4 px-6 '>
                                        <button type='button' onClick={() => onOpen('messageFile', {apiUrl, query})} className='absolute top-6 left-8 h-[24px] w-[24px] bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'><Plus className='text-white dark:text-[#313383]' /></button>
                                        <Input disabled={isLoading} className='px-14 bg-zinc-200 dark:bg-zinc-600 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0  ' placeholder={`Message ${type == 'conversation' ? name : '#' + name}`} {...field} />
                                        <div className='absolute top-6 right-8 cursor-pointer '>
                                            <EmojiPicker onChange={(emoji: string) => field.onChange(`${field.value}${emoji}`)} />
                                        </div>
                                    </div>         
                                </FormControl>
                            </FormItem>
                        )}
                    />
            </form>
        </Form>
    </div>
  )
}

export default ChatInput