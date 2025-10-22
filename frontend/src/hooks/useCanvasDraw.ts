import { useCallback, useEffect, useRef } from "react";
import { drawWhiteboard } from "../utils/draw/drawWhiteboard";
import type { WhiteboardData } from "../types";
import { drawData } from "../utils/draw/drawData";

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
  WORLD_SIZE_X: number,
  WORLD_SIZE_Y: number,
  dataRef: React.RefObject<WhiteboardData>,
) => {
  const animationFrameRef = useRef<number | null>(null);
  const whiteboardRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

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
    const whiteboardX = worldX - (WORLD_SIZE_X / 2) * zoom;
    const whiteboardY = worldY - (WORLD_SIZE_Y / 2) * zoom;
    const whiteboardWidth = WORLD_SIZE_X * zoom;
    const whiteboardHeight = WORLD_SIZE_Y * zoom;

    whiteboardRef.current = {
      x: whiteboardX,
      y: whiteboardY,
      width: whiteboardWidth,
      height: whiteboardHeight,
    };

    ctx.fillStyle = COLORS.whiteboard;
    drawWhiteboard({
      ctx,
      x: whiteboardX,
      y: whiteboardY,
      width: whiteboardWidth,
      height: whiteboardHeight,
    });

    drawData({ ctx, data: dataRef.current, whiteboardRef, zoom });

    // Request next frame
    animationFrameRef.current = requestAnimationFrame(draw);
  }, [WORLD_SIZE_X, WORLD_SIZE_Y, cameraRef, zoomRef, canvasRef, dataRef]);

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

  return whiteboardRef;
};
