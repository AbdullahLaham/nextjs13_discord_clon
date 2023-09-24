import qs from 'query-string';
import { useSocket } from '@/components/providers/socket-provider';
import {useInfiniteQuery} from '@tanstack/react-query';

import axios from 'axios';

interface ChatQueryProps {
    queryKey: string,
    apiUrl: string,
    paramKey: "channelId" | "conversationId",
    paramValue: string,
}
export const useChatQuery = async ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
    const {isConnected} = useParams();
    const fetchMessages = async ({pageParam = undefined}) => {
        const url = qs.stringifyUrl({
            url: apiUrl,
            query: {
                cursor: pageParam,
                [paramKey]: paramValue,
            }
        }, {skipNull: true})
        const res = await axios.get(url);
        return res;
    }
    
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage: any) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000, // if there is no socket connection
    })


    
    return {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} ;
    



}