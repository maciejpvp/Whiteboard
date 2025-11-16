import { useEffect, useRef } from "react";
import { WhiteboardData } from "@/types";

type Props = {
  data: WhiteboardData;
  width?: number;
  height?: number;
};

export const WhiteboardPreview = ({
  data,
  width = 150,
  height = 100,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    if (data.length === 0) return;

    // Zbieramy wszystkie punkty referencyjne
    const allPoints: { x: number; y: number }[] = [];

    data.forEach((el) => {
      if (el.type === "line") {
        allPoints.push(...el.points);
      }
      if (el.type === "text") {
        allPoints.push({ x: el.x, y: el.y });
      }
    });

    if (allPoints.length === 0) return;

    const minX = Math.min(...allPoints.map((p) => p.x));
    const maxX = Math.max(...allPoints.map((p) => p.x));
    const minY = Math.min(...allPoints.map((p) => p.y));
    const maxY = Math.max(...allPoints.map((p) => p.y));

    const scaleX = width / (maxX - minX || 1);
    const scaleY = height / (maxY - minY || 1);
    const scale = Math.min(scaleX, scaleY) * 0.95; // margines

    // Rysowanie elementów
    for (const el of data) {
      if (el.type === "line") {
        ctx.strokeStyle = el.color;
        ctx.lineWidth = Math.max(1, el.size * (scale / 8));
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();

        el.points.forEach((p, i) => {
          const x = (p.x - minX) * scale;
          const y = (p.y - minY) * scale;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });

        ctx.stroke();
      }

      if (el.type === "text") {
        ctx.fillStyle = el.color;
        ctx.font = `${el.fontSize * scale * 0.15}px ${el.fontFamily ?? "Arial"}`;
        const x = (el.x - minX) * scale;
        const y = (el.y - minY) * scale;
        ctx.fillText(el.text, x, y);
      }
    }
  }, [data, width, height]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};
