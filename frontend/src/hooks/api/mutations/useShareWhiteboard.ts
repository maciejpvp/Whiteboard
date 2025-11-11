import { useMutation, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/constants/queryKeys";
import { whiteboardApi } from "@/api/whiteboard";
import { oldItemsType } from "@/types";

export const useShareWhiteboard = () => {
  const queryClient = useQueryClient();

  const handleSuccess = (
    id: string,
    email: string,
    access: "read" | "write",
  ) => {
    queryClient.setQueryData(
      queryKeys.vault.itemList,
      (oldItems: oldItemsType | undefined) => {
        if (!oldItems || !oldItems.list) return oldItems;

        const edited = oldItems.list.map((item) => {
          if (item.WhiteboardId !== id) return item;

          return {
            ...item,
            shareTo: [...(item.shareTo ?? []), { userId: email, access }],
          };
        });

        console.log({
          ...oldItems,
          list: edited,
        });

        return {
          ...oldItems,
          list: edited,
        };
      },
    );
  };

  const mutation = useMutation({
    mutationFn: async ({
      id,
      email,
      access,
    }: {
      id: string;
      email: string;
      access: "read" | "write";
    }) => {
      const response = await whiteboardApi.shareWhiteboard(id, email, access);

      return response.data;
    },
    onSuccess: (_data, varibles) => {
      const { id, email, access } = varibles;
      handleSuccess(id, email, access);
    },
  });

  return { ...mutation, triggerSuccess: handleSuccess };
};
