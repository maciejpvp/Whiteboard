import type { WhiteboardData } from "../../types";

export const drawData = (
  ctx: CanvasRenderingContext2D,
  data: WhiteboardData,
  whiteboardRef: React.RefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>,
  zoom: number,
) => {
  if (!data) return;
  data.forEach((line) => {
    if (line.points.length < 2) return;
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.size * zoom;
    ctx.beginPath();
    ctx.moveTo(
      line.points[0].x * zoom + whiteboardRef.current.x,
      line.points[0].y * zoom + whiteboardRef.current.y,
    );
    for (let i = 1; i < line.points.length; i++) {
      ctx.lineTo(
        line.points[i].x * zoom + whiteboardRef.current.x,
        line.points[i].y * zoom + whiteboardRef.current.y,
      );
    }
    ctx.stroke();
  });
};
