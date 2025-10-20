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
) => {
  if (!data) return;
  data.forEach((line) => {
    if (line.points.length < 2) return;
    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.size;
    ctx.beginPath();
    ctx.moveTo(
      line.points[0].x + whiteboardRef.current.x,
      line.points[0].y + whiteboardRef.current.y,
    );
    for (let i = 1; i < line.points.length; i++) {
      ctx.lineTo(
        line.points[i].x + whiteboardRef.current.x,
        line.points[i].y + whiteboardRef.current.y,
      );
    }
    ctx.stroke();
  });
};
