import { useRef, useEffect, useState } from "react";
import { useCanvasCamera } from "../hooks/useCanvasCamera";
import { useCanvasDraw } from "../hooks/useCanvasDraw";
import type { InteractionConfig, WhiteboardData } from "../types";
import { useWhiteboardInteractions } from "../hooks/useWhiteboardInteractions";
import { drawData } from "../utils/drawData";

export const Canvas = () => {
  const [data, setData] = useState<WhiteboardData>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { cameraX, cameraY, cameraZoom } = useCanvasCamera(canvasRef);
  const { draw } = useCanvasDraw(canvasRef, cameraX, cameraY, cameraZoom);
  const interaction: InteractionConfig = {
    mode: "draw-line",
    color: "black",
    size: 2,
  };
  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useWhiteboardInteractions(setData, interaction);

  useEffect(() => {
    draw(); // czyści i rysuje tło
    drawData(canvasRef, data, cameraX, cameraY, cameraZoom);
  }, [draw, data, cameraX, cameraY, cameraZoom]);

  console.log(data);
  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full bg-zinc-200"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    />
  );
};
