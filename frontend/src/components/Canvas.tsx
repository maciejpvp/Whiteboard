import { useRef } from "react";
import { useCanvasDraw } from "../hooks/useCanvasDraw";
import { useCameraMovement } from "../hooks/useCameraMovement";
import { useCameraZoom } from "../hooks/useCameraZoom";
import { useWhiteboardInteractions } from "../hooks/useWhiteboardInteractions";

const WORLD_SIZE_X = 1000;
const WORLD_SIZE_Y = 1000;

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoomRef = useCameraZoom();
  const cameraRef = useCameraMovement({ zoom: zoomRef });

  const whiteboardRef = useCanvasDraw(
    canvasRef,
    cameraRef,
    zoomRef,
    WORLD_SIZE_X,
    WORLD_SIZE_Y,
  );

  const onClick = useWhiteboardInteractions({
    whiteboardRef,
    WORLD_SIZE_X,
    WORLD_SIZE_Y,
  });

  return <canvas ref={canvasRef} className="w-full h-full" onClick={onClick} />;
};
