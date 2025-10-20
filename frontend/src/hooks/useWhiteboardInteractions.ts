import { useRef } from "react";
import { getWhiteboardCoords } from "../utils/draw/getWhiteboardCoords";
import { isCursorInsideWhiteboard } from "../utils/isCursorInsideWhiteboard";
import type { LineElement, Point } from "../types";

type Props = {
  whiteboardRef: React.RefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  WORLD_SIZE_X: number;
  WORLD_SIZE_Y: number;
  isSpacePressedRef: React.RefObject<boolean>;
  dataRef: React.RefObject<LineElement[]>;
};

export const useWhiteboardInteractions = ({
  whiteboardRef,
  WORLD_SIZE_X,
  WORLD_SIZE_Y,
  isSpacePressedRef,
  dataRef,
}: Props) => {
  const isClickedRef = useRef<boolean>(false);
  const newEntryRef = useRef<LineElement | null>(null);

  const distance = (p1: Point, p2: Point) =>
    Math.hypot(p2.x - p1.x, p2.y - p1.y);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isSpacePressedRef.current) return;
    if (!isCursorInsideWhiteboard(e, whiteboardRef)) return;

    isClickedRef.current = true;

    const { x, y } = getWhiteboardCoords(
      e,
      whiteboardRef,
      WORLD_SIZE_X,
      WORLD_SIZE_Y,
    );
    const newLine: LineElement = {
      type: "line",
      points: [{ x, y }],
      color: "#000",
      size: 2,
    };

    newEntryRef.current = newLine;
    dataRef.current = [...dataRef.current, newLine];
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
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

    if (distance(lastPoint, { x, y }) > 10) {
      points.push({ x, y });
    }
  };

  const onPointerUp = () => {
    isClickedRef.current = false;
    newEntryRef.current = null;
  };

  return { onPointerMove, onPointerDown, onPointerUp };
};
