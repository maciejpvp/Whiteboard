import { whiteboardApi } from "@/api/whiteboard";
import { queryKeys } from "@/constants/queryKeys";
import { ListType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useGetList = () => {
  return useQuery({
    queryKey: queryKeys.vault.itemList,
    queryFn: async () => {
      const response = await whiteboardApi.getList();

      const list: ListType = response.data.data.items;

      if (!list) return [];

      return list;
    },
    staleTime: 15 * 60 * 1000,
  });
};
