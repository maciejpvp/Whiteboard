import { useCallback, useState } from "react";
import type {
  InteractionConfig,
  Point,
  ShapeElement,
  WhiteboardData,
} from "../types";

export const useWhiteboardInteractions = (
  setData: React.Dispatch<React.SetStateAction<WhiteboardData>>,
  config: InteractionConfig,
) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<Point | null>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (config.mode === "draw-line") {
        setIsDrawing(true);
        setStartPos({ x, y });
        setData((prev) => [
          ...prev,
          {
            type: "line",
            points: [{ x, y }],
            color: config.color,
            size: config.size,
          },
        ]);
      } else if (config.mode === "draw-shape") {
        setStartPos({ x, y });
        setIsDrawing(true);
      } else if (config.mode === "text") {
        setData((prev) => [
          ...prev,
          {
            type: "text",
            x,
            y,
            text: config.text,
            color: config.color,
            fontSize: config.fontSize,
            fontFamily: config.fontFamily,
          },
        ]);
      }
    },
    [config, setData],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !startPos) return;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (config.mode === "draw-line") {
        setData((prev) => {
          const newData = [...prev];
          const last = newData[newData.length - 1];
          if (last?.type === "line") {
            last.points.push({ x, y });
          }
          return newData;
        });
      }
    },
    [config.mode, isDrawing, startPos, setData],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !startPos) return;
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (config.mode === "draw-shape") {
        const shapeEl: ShapeElement = {
          type: "shape",
          shape: config.shape,
          x: startPos.x,
          y: startPos.y,
          width: Math.abs(x - startPos.x),
          height: Math.abs(y - startPos.y),
          radius: Math.hypot(x - startPos.x, y - startPos.y) / 2,
          color: config.color,
          fill: config.fill,
          size: config.size,
        };
        setData((prev) => [...prev, shapeEl]);
      }

      setIsDrawing(false);
      setStartPos(null);
    },
    [config, isDrawing, startPos, setData],
  );

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    isDrawing,
  };
};
