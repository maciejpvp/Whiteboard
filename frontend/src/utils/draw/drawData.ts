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
    ctx.fillStyle = line.color;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = 1; i < line.points.length; i++) {
      const p0 = line.points[i - 1];
      const p1 = line.points[i];

      const x0 = p0.x * zoom + whiteboardRef.current.x;
      const y0 = p0.y * zoom + whiteboardRef.current.y;
      const x1 = p1.x * zoom + whiteboardRef.current.x;
      const y1 = p1.y * zoom + whiteboardRef.current.y;

      const dx = x1 - x0;
      const dy = y1 - y0;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.ceil(dist / (line.size * zoom * 0.3));

      for (let j = 0; j < steps; j++) {
        const t = j / steps;
        const x = x0 + dx * t;
        const y = y0 + dy * t;

        ctx.beginPath();
        ctx.arc(x, y, (line.size * zoom) / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
};
