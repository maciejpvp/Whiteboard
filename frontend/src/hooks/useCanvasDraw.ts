import { useCallback, useEffect, useRef } from "react";
import { drawWhiteboard } from "../utils/drawWhiteboard";

const COLORS = {
  background: "#111",
  whiteboard: "#eee",
  dot: "#ff5555",
};

type CoordsRef = { current: { x: number; y: number } };
type ZoomRef = { current: number };

export const useCanvasDraw = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cameraRef: CoordsRef | null,
  zoomRef: ZoomRef | null,
  WORLD_SIZE_X = 1000,
  WORLD_SIZE_Y = 1000,
) => {
  const animationFrameRef = useRef<number | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef?.current;
    const camera = cameraRef?.current;
    const zoom = zoomRef?.current;

    if (!canvas || !camera || zoom === undefined) {
      animationFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    const cameraX = camera.x;
    const cameraY = camera.y;

    const worldX = canvas.width / 2 - cameraX * zoom;
    const worldY = canvas.height / 2 - cameraY * zoom;

    // Background
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Whiteboard
    ctx.fillStyle = COLORS.whiteboard;
    drawWhiteboard({ ctx, worldX, worldY, WORLD_SIZE_X, WORLD_SIZE_Y, zoom });

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(draw);
  }, [WORLD_SIZE_X, WORLD_SIZE_Y, cameraRef, zoomRef, canvasRef]);

  useEffect(() => {
    draw();

    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [draw]);
};
