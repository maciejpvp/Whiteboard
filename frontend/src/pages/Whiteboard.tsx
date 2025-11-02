import { whiteboardApi } from "@/api/whiteboard";
import { Canvas } from "../components/Whiteboard/Canvas";
import { CanvasWrapper } from "../components/Whiteboard/CanvasWrapper";
import { Menu } from "../components/Whiteboard/Menu";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { WhiteboardData } from "@/types";
import { ProjectNavbar } from "@/components/Whiteboard/ProjectNavbar";
import { SpinnerPage } from "./Spinner";
import { useAuthStore } from "@/store/authStore";

export const Whiteboard = () => {
  const { id } = useParams();
  const [dataValue, setDataValue] = useState<WhiteboardData | null>(null);
  const [title, setTitle] = useState<string>("");
  const token = useAuthStore((store) => store.idToken);

  useEffect(() => {
    if (!token) return;
    (async () => {
      if (id?.trim() === "") return;

      const response = await whiteboardApi.getItem(id ?? "");
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
