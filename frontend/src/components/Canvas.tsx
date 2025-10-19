import { useRef } from "react";
import { useCanvasDraw } from "../hooks/useCanvasDraw";
import { useCameraMovement } from "../hooks/useCameraMovement";
import { useCameraZoom } from "../hooks/useCameraZoom";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { camera } = useCameraMovement();
  const { zoom } = useCameraZoom();

  useCanvasDraw(canvasRef, camera.x, camera.y, zoom);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
