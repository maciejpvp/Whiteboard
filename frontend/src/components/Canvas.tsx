import { useRef, useState } from "react";
import { useCanvasDraw } from "../hooks/useCanvasDraw";
import { useCameraMovement } from "../hooks/useCameraMovement";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { camera } = useCameraMovement();
  const [zoom, setZoom] = useState(1);

  useCanvasDraw(canvasRef, camera.x, camera.y, zoom);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
