import { useWhiteboardStore } from "../../store/whiteboardStore";
import type { LineElement, Point, WhiteboardData } from "../../types";
import { getWhiteboardCoords } from "../draw/getWhiteboardCoords";
import { isCursorInsideWhiteboard } from "../isCursorInsideWhiteboard";
import { v4 as uuidv4 } from "uuid";

type DrawLineProps = {
  e: React.PointerEvent<HTMLCanvasElement>;
  whiteboardRef: React.RefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  WORLD_SIZE_X: number;
  WORLD_SIZE_Y: number;
  dataRef: React.RefObject<WhiteboardData>;
  newEntryRef: React.RefObject<LineElement | null>;
  isClickedRef: React.RefObject<boolean>;
};

const distance = (p1: Point, p2: Point) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

export const brush = {
  onPointerDown: ({
    e,
    whiteboardRef,
    WORLD_SIZE_X,
    WORLD_SIZE_Y,
    dataRef,
    newEntryRef,
    isClickedRef,
  }: DrawLineProps) => {
    if (e.button !== 0) return; // left click only
    if (!isCursorInsideWhiteboard(e, whiteboardRef)) return;

    isClickedRef.current = true;

    const { x, y } = getWhiteboardCoords(
      e,
      whiteboardRef,
      WORLD_SIZE_X,
      WORLD_SIZE_Y,
    );

    const newLine: LineElement = {
      id: uuidv4(),
      type: "line",
      points: [{ x, y }],
      color: useWhiteboardStore.getState().color,
      size: useWhiteboardStore.getState().brushSize,
    };

    newEntryRef.current = newLine;
    dataRef.current = [...dataRef.current, newLine];
  },

  onPointerMove: ({
    e,
    whiteboardRef,
    WORLD_SIZE_X,
    WORLD_SIZE_Y,
    newEntryRef,
    isClickedRef,
  }: DrawLineProps) => {
    if (!isClickedRef.current || !newEntryRef.current) return;
    if (!isCursorInsideWhiteboard(e, whiteboardRef)) return;

    const { x, y } = getWhiteboardCoords(
      e,
      whiteboardRef,
      WORLD_SIZE_X,
      WORLD_SIZE_Y,
    );
    const points = newEntryRef.current.points;
    const lastPoint = points[points.length - 1];

    if (distance(lastPoint, { x, y }) > 1) {
      points.push({ x, y });
    }
  },

  onPointerUp: (
    isClickedRef: React.RefObject<boolean>,
    newEntryRef: React.RefObject<LineElement | null>,
  ) => {
    isClickedRef.current = false;
    newEntryRef.current = null;
  },

  drawData: (
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
      if (line.type !== "line") return;

      ctx.strokeStyle = line.color;
      ctx.fillStyle = line.color;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (line.points.length === 1) {
        const p = line.points[0];
        const x = p.x * zoom + whiteboardRef.current!.x;
        const y = p.y * zoom + whiteboardRef.current!.y;

        ctx.beginPath();
        ctx.arc(x, y, (line.size * zoom) / 2, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      for (let i = 1; i < line.points.length; i++) {
        const p0 = line.points[i - 1];
        const p1 = line.points[i];

        const x0 = p0.x * zoom + whiteboardRef.current!.x;
        const y0 = p0.y * zoom + whiteboardRef.current!.y;
        const x1 = p1.x * zoom + whiteboardRef.current!.x;
        const y1 = p1.y * zoom + whiteboardRef.current!.y;

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
  },
};
