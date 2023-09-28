import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, Profile } from "@prisma/client";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

export const useChatQuery = ({ queryKey, apiUrl, paramKey, paramValue }: ChatQueryProps) => {
    const {isConnected} = useSocket();
    console.log(queryKey, apiUrl, paramKey, paramValue, 'rrrrrrrr')
    const fetchMessages = async ({ pageParam = undefined }) => {
        try {
          const url = qs.stringifyUrl({
            url: apiUrl,
            
            query: {
              cursor: pageParam,
              [paramKey]: paramValue,
            }
  
          }, { skipNull: true });
      
          const res = await fetch(url);
          
          const data =  res.json();
          console.log(data, 'rrrrrrrrrrrrrrr')
          return data;
        } catch(error) {
          console.log(error)
        }
      };
    
    
    const {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchMessages,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
      });
    


    
    return {data, fetchNextPage, hasNextPage, isFetchingNextPage, status} ;
    



}