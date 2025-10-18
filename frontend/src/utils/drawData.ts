import type { WhiteboardData, WhiteboardElement } from "../types";
import type { RefObject } from "react";

export const drawData = (
  canvasRef: RefObject<HTMLCanvasElement | null>,
  data: WhiteboardData,
  cameraX: number,
  cameraY: number,
  cameraZoom: number,
) => {
  if (!canvasRef.current) return;
  const ctx = canvasRef.current.getContext("2d");
  if (!ctx) return;

  const toScreenX = (x: number) =>
    (x - cameraX) * cameraZoom + canvasRef.current!.width / 2;
  const toScreenY = (y: number) =>
    (y - cameraY) * cameraZoom + canvasRef.current!.height / 2;

  data.forEach((el: WhiteboardElement) => {
    if (el.type === "line") {
      ctx.strokeStyle = el.color;
      ctx.lineWidth = el.size * cameraZoom;
      ctx.beginPath();
      el.points.forEach((p, i) => {
        const x = toScreenX(p.x);
        const y = toScreenY(p.y);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    } else if (el.type === "shape") {
      ctx.fillStyle = el.fill ? el.color : "transparent";
      ctx.strokeStyle = el.color;
      ctx.lineWidth = (el.size || 2) * cameraZoom;

      if (el.shape === "rectangle") {
        ctx.beginPath();
        ctx.rect(
          toScreenX(el.x),
          toScreenY(el.y),
          (el.width || 0) * cameraZoom,
          (el.height || 0) * cameraZoom,
        );
        if (el.fill) ctx.fill();
        else ctx.stroke();
      } else if (el.shape === "circle") {
        ctx.beginPath();
        ctx.arc(
          toScreenX(el.x),
          toScreenY(el.y),
          (el.radius || 0) * cameraZoom,
          0,
          Math.PI * 2,
        );
        if (el.fill) ctx.fill();
        else ctx.stroke();
      } else if (el.shape === "triangle") {
        ctx.beginPath();
        ctx.moveTo(toScreenX(el.x), toScreenY(el.y));
        ctx.lineTo(
          toScreenX(el.x + (el.width || 0)),
          toScreenY(el.y + (el.height || 0)),
        );
        ctx.lineTo(
          toScreenX(el.x - (el.width || 0)),
          toScreenY(el.y + (el.height || 0)),
        );
        ctx.closePath();
        if (el.fill) ctx.fill();
        else ctx.stroke();
      }
    } else if (el.type === "text") {
      ctx.fillStyle = el.color;
      ctx.font = `${el.fontSize * cameraZoom}px ${el.fontFamily || "sans-serif"}`;
      ctx.fillText(el.text, toScreenX(el.x), toScreenY(el.y));
    }
  });
};
