import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { ItemType, oldItemsType } from "@/types";
import { whiteboardApi } from "@/api/whiteboard";

export const useCreateWhiteboard = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (newItem: ItemType) => {
    queryClient.setQueryData(
      queryKeys.vault.itemList,
      (oldItems: oldItemsType | undefined) => {
        if (!oldItems || !oldItems.list) return oldItems;

        const exists = oldItems.list.some(
          (item) => item.WhiteboardId === newItem.WhiteboardId,
        );

        if (exists) return oldItems;

        console.log({
          ...oldItems,
          list: [...oldItems.list, newItem],
        });

        return {
          ...oldItems,
          list: [...oldItems.list, newItem],
        };
      },
    );
  };

  const mutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await whiteboardApi.createProject(name);

      return response.data;
    },
    onSuccess: (data) => {
      const newItem = data.data.item;

      handleSuccess(newItem);
    },
  });

  return { ...mutation, triggerSuccess: handleSuccess };
};
