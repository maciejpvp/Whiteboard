import { useWhiteboardStore } from "../../store/whiteboardStore";
import type { TextElement, WhiteboardData } from "../../types";
import { getWhiteboardCoords } from "../draw/getWhiteboardCoords";
import { isCursorInsideWhiteboard } from "../isCursorInsideWhiteboard";

type TextProps = {
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
};

export const textTool = {
  onPointerDown: ({
    e,
    whiteboardRef,
    WORLD_SIZE_X,
    WORLD_SIZE_Y,
    dataRef,
  }: TextProps) => {
    if (e.button !== 0) return; // left click only
    if (!isCursorInsideWhiteboard(e, whiteboardRef)) return;

    const { x, y } = getWhiteboardCoords(
      e,
      whiteboardRef,
      WORLD_SIZE_X,
      WORLD_SIZE_Y,
    );
    const color = useWhiteboardStore.getState().color;

    const newText: TextElement = {
      type: "text",
      x,
      y,
      text: "TEST",
      color,
      fontSize: useWhiteboardStore.getState().textSize,
    };

    dataRef.current = [...dataRef.current, newText];
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
    data.forEach((el) => {
      if (el.type !== "text") return;

      ctx.fillStyle = el.color;
      ctx.font = `${el.fontSize * zoom}px sans-serif`;
      ctx.textBaseline = "top";

      const x = el.x * zoom + whiteboardRef.current!.x;
      const y = el.y * zoom + whiteboardRef.current!.y;

      ctx.fillText(el.text, x, y);
    });
  },
};
