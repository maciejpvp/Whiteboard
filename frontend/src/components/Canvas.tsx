import { useEffect, useRef } from "react";
import { useCanvasDraw } from "../hooks/useCanvasDraw";
import { useCameraMovement } from "../hooks/useCameraMovement";
import { useCameraZoom } from "../hooks/useCameraZoom";
import { useWhiteboardInteractions } from "../hooks/useWhiteboardInteractions";
import type { WhiteboardData } from "../types";

const WORLD_SIZE_X = 1000;
const WORLD_SIZE_Y = 1000;

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoomRef = useCameraZoom();
  const isSpacePressedRef = useRef<boolean>(false);
  const dataRef = useRef<WhiteboardData>([]);

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
