import { whiteboardApi } from "@/api/whiteboard";
import { Canvas } from "../components/Whiteboard/Canvas";
import { CanvasWrapper } from "../components/Whiteboard/CanvasWrapper";
import { Menu } from "../components/Whiteboard/Menu";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WhiteboardData } from "@/types";
import { ProjectNavbar } from "@/components/Whiteboard/ProjectNavbar";
import { SpinnerPage } from "./Spinner";
import { useAuthStore } from "@/store/authStore";
import { useWhiteboardStore } from "@/store/whiteboardStore";

export const Whiteboard = () => {
  const location = useLocation();
  const { id } = useParams();
  const [dataValue, setDataValue] = useState<WhiteboardData | null>(null);
  const [title, setTitle] = useState<string>("");
  const token = useAuthStore((store) => store.idToken);
  const setOwnerId = useWhiteboardStore((store) => store.setOwnerId);

  useEffect(() => {
    if (!token) return;
    (async () => {
      if (id?.trim() === "") return;

      let response;

      if (location.state?.ownerId) {
        response = await whiteboardApi.getSharedItem(
          id ?? "",
          location.state.ownerId,
        );
        setOwnerId(location.state.ownerId);
      } else {
        response = await whiteboardApi.getItem(id ?? "");
        setOwnerId(useAuthStore.getState().user?.sub ?? "");
      }

      const item = response.data?.data.item;

      if (!item.data) {
        setDataValue([]);
        return;
      }

      const itemData = item.data;

      setDataValue([...itemData]);
      setTitle(item.Title);
    })();
  }, [id, token]);

  if (dataValue === null) return <SpinnerPage />;

  return (
    <div className="w-dvw h-dvh bg-zinc-100 flex flex-col justify-center items-center">
      <ProjectNavbar title={title} />
      <CanvasWrapper>
        <Canvas defaultDataValue={dataValue} />
      </CanvasWrapper>
      <Menu />
    </div>
  );
};
