import { useRef } from "react";
import { useCanvasDraw } from "../hooks/useCanvasDraw";
import { useCameraMovement } from "../hooks/useCameraMovement";
import { useCameraZoom } from "../hooks/useCameraZoom";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const zoomRef = useCameraZoom();
  const cameraRef = useCameraMovement({ zoom: zoomRef });

  useCanvasDraw(canvasRef, cameraRef, zoomRef);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
