import { useCallback, useEffect } from "react";

export const useCanvasDraw = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cameraX: number,
  cameraY: number,
  zoom: number,
  WORLD_SIZE_X = 1000,
  WORLD_SIZE_Y = 1000,
) => {
  const draw = useCallback(() => {
    console.log("Draw");
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const worldX = canvas.width / 2 - cameraX * zoom;
    const worldY = canvas.height / 2 - cameraY * zoom;

    ctx.fillStyle = "#eee";
    ctx.fillRect(
      worldX - (WORLD_SIZE_X / 2) * zoom,
      worldY - (WORLD_SIZE_Y / 2) * zoom,
      WORLD_SIZE_X * zoom,
      WORLD_SIZE_Y * zoom,
    );
  }, [canvasRef, cameraX, cameraY, zoom, WORLD_SIZE_X, WORLD_SIZE_Y]);

  useEffect(() => {
    draw();
  }, [cameraX, cameraY, zoom, draw]);

  useEffect(() => {
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, [draw]);
};
