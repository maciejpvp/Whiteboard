import { useEffect, useRef } from "react";
import { useCanvasDraw } from "../../hooks/useCanvasDraw";
import { useCameraMovement } from "../../hooks/useCameraMovement";
import { useCameraZoom } from "../../hooks/useCameraZoom";
import { useWhiteboardInteractions } from "../../hooks/useWhiteboardInteractions";
import type { WhiteboardData, WhiteboardElement } from "../../types";
import { useWebSocketStore } from "@/store/wsStore";
import { mutateUpdatedAt } from "@/utils/mutateUpdatedAt";

const WORLD_SIZE_X = 1000;
const WORLD_SIZE_Y = 1000;

export const Canvas = ({
  defaultDataValue,
}: {
  defaultDataValue: WhiteboardData;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoomRef = useCameraZoom();
  const isSpacePressedRef = useRef<boolean>(false);
  const dataRef = useRef<WhiteboardData>(defaultDataValue);

  const on = useWebSocketStore((store) => store.on);
  const off = useWebSocketStore((store) => store.off);

  const { cameraRef, handleMouseDown, handleMouseMove, handleMouseUp } =
    useCameraMovement({ zoom: zoomRef, isSpacePressedRef });

  const whiteboardRef = useCanvasDraw(
    canvasRef,
    cameraRef,
    zoomRef,
    WORLD_SIZE_X,
    WORLD_SIZE_Y,
    dataRef,
  );

  const { onPointerMove, onPointerDown, onPointerUp } =
    useWhiteboardInteractions({
      whiteboardRef,
      WORLD_SIZE_X,
      WORLD_SIZE_Y,
      isSpacePressedRef,
      dataRef,
    });

  useEffect(() => {
    const targetElement = document.body;

    const handleSpacePressed = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressedRef.current = true;
        targetElement.classList.add("cursor-grab");
      }
    };
    const handleSpaceReleased = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressedRef.current = false;
        targetElement.classList.remove("cursor-grab");
      }
    };

    window.addEventListener("keydown", handleSpacePressed);
    window.addEventListener("keyup", handleSpaceReleased);

    return () => {
      window.removeEventListener("keydown", handleSpacePressed);
      window.removeEventListener("keyup", handleSpaceReleased);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    onPointerMove(e);
    handleMouseMove(e);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    onPointerDown(e);
    handleMouseDown(e);
  };

  const handlePointerUp = () => {
    onPointerUp();
    handleMouseUp();
  };

  // Real Time useImperativeHandle(

  useEffect(() => {
    const handler = (data: {
      whiteboardId: string;
      newObject: WhiteboardElement;
    }) => {
      if (dataRef.current.some((i) => i.id === data.newObject.id)) return;

      dataRef.current.push(data.newObject);

      //Edit updatedAt attribute of whiteboard
      mutateUpdatedAt(data.whiteboardId);
    };

    on("WHITEBOARD_DATA_UPDATE", handler);

    return () => {
      off("WHITEBOARD_DATA_UPDATE", handler);
    };
  }, [on, off]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    />
  );
};
