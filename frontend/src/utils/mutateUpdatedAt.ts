import { queryKeys } from "@/constants/queryKeys";
import { queryClient } from "@/lib/queryClient";
import { oldItemsType } from "@/types";

export const mutateUpdatedAt = (id: string) => {
  queryClient.setQueryData(
    queryKeys.vault.itemList,
    (oldData: oldItemsType) => {
      return {
        ...oldData,
        list: oldData.list.map((item) => {
          if (item.WhiteboardId === id) {
            return { ...item, updatedAt: new Date().toISOString() };
          }
          return item;
        }),
      };
    },
  );
};
