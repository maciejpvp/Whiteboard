import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { oldItemsType } from "@/types";
import { whiteboardApi } from "@/api/whiteboard";

export const useDeleteWhiteboard = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (id: string) => {
    queryClient.setQueryData(
      queryKeys.vault.itemList,
      (oldItems: oldItemsType) => {
        return {
          ...oldItems,
          list: oldItems.list.filter((item) => item.WhiteboardId !== id),
        };
      },
    );
  };

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await whiteboardApi.deleteWhiteboard(id);

      console.log(response);

      return response.data;
    },
    onSuccess: (_data, id) => {
      console.log(id);
      handleSuccess(id);
    },
  });

  return { ...mutation, triggerSuccess: handleSuccess };
};
