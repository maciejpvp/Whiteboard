import { useRef, useState } from "react";
import { useCanvasDraw } from "../hooks/useCanvasDraw";

export const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  useCanvasDraw(canvasRef, camera.x, camera.y, zoom);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};
