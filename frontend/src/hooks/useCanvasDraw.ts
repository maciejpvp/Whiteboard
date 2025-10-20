import { useCallback, useEffect } from "react";

const COLORS = {
  background: "#000000",
  whiteboard: "#eeeeee",
  dot: "#ff5555",
};

export const useCanvasDraw = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cameraX: number,
  cameraY: number,
  zoom: number,
  WORLD_SIZE_X = 1000,
  WORLD_SIZE_Y = 1000,
) => {
  const drawDot = (ctx: CanvasRenderingContext2D) => {
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = useCallback(() => {
    console.log("Draw");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const worldX = canvas.width / 2 - cameraX * zoom;
    const worldY = canvas.height / 2 - cameraY * zoom;

    ctx.fillStyle = COLORS.whiteboard;
    ctx.fillRect(
      worldX - (WORLD_SIZE_X / 2) * zoom,
      worldY - (WORLD_SIZE_Y / 2) * zoom,
      WORLD_SIZE_X * zoom,
      WORLD_SIZE_Y * zoom,
    );

    ctx.fillStyle = COLORS.dot;
    drawDot(ctx);
  }, [canvasRef, cameraX, cameraY, zoom, WORLD_SIZE_X, WORLD_SIZE_Y]);

  useEffect(() => {
    draw();
  }, [cameraX, cameraY, zoom, draw]);

  useEffect(() => {
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);
};
