import { useCallback } from "react";

export const useCanvasDraw = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  cameraX: number,
  cameraY: number,
  cameraZoom: number,
) => {
  const drawDot = useCallback(
    (x: number, y: number, radius: number, color: string) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const screenX = (x - cameraX) * cameraZoom + canvas.width / 2;
      const screenY = (y - cameraY) * cameraZoom + canvas.height / 2;

      ctx.beginPath();
      ctx.arc(screenX, screenY, radius * cameraZoom, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    },
    [canvasRef, cameraX, cameraY, cameraZoom],
  );

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  const drawBackground = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 2;
    const gap = 24;

    const width = canvas.width;
    const height = canvas.height;

    const startX = Math.floor((cameraX - width / 2 / cameraZoom) / gap) * gap;
    const endX = Math.ceil((cameraX + width / 2 / cameraZoom) / gap) * gap;
    const startY = Math.floor((cameraY - height / 2 / cameraZoom) / gap) * gap;
    const endY = Math.ceil((cameraY + height / 2 / cameraZoom) / gap) * gap;

    for (let x = startX; x <= endX; x += gap) {
      for (let y = startY; y <= endY; y += gap) {
        drawDot(x, y, size, "gray");
      }
    }
  }, [canvasRef, cameraX, cameraY, cameraZoom, drawDot]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    clearCanvas();
    drawBackground();
  }, [canvasRef, clearCanvas, drawBackground]);

  return { draw, drawDot, clearCanvas };
};
