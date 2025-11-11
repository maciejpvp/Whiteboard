import { whiteboardApi } from "@/api/whiteboard";
import { useWhiteboardStore } from "../../store/whiteboardStore";
import type { TextElement, WhiteboardData } from "../../types";
import { getWhiteboardCoords } from "../draw/getWhiteboardCoords";
import { isCursorInsideWhiteboard } from "../isCursorInsideWhiteboard";
import { v4 as uuidv4 } from "uuid";
import { getProjectId } from "../getProjectId";
import { mutateUpdatedAt } from "../mutateUpdatedAt";

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
    if (e.button !== 0) return;
    if (!isCursorInsideWhiteboard(e, whiteboardRef)) return;

    // Check if user write something already
    if (document.getElementById("text-input")) return;

    const { x, y } = getWhiteboardCoords(
      e,
      whiteboardRef,
      WORLD_SIZE_X,
      WORLD_SIZE_Y,
    );
    const color = useWhiteboardStore.getState().color;
    const fontSize = useWhiteboardStore.getState().textSize;

    const input = document.createElement("input");
    input.type = "text";
    input.id = "text-input";
    Object.assign(input.style, {
      position: "absolute",
      left: "-9999px",
      top: "-9999px",
      color: "transparent",
      background: "red",
      opacity: "0",
      width: "0px",
      height: "0px",
      border: "none",
      outline: "none",
      pointerEvents: "none",
    });
    document.body.appendChild(input);
    setTimeout(() => input.focus(), 0);
    document.body.classList.add("cursor-text");

    const currentText: TextElement = {
      id: uuidv4(),
      type: "text",
      x,
      y,
      text: "",
      color,
      fontSize,
    };
    dataRef.current = [...dataRef.current, currentText];

    input.addEventListener("input", () => {
      currentText.text = input.value;
    });

    const finish = () => {
      // Make sure finish is called once
      setTimeout(() => {
        if (input.parentNode) input.parentNode.removeChild(input);
      }, 0);

      if (!document.body.classList.contains("cursor-text")) {
        console.log("removing");
        return;
      }
      document.body.classList.remove("cursor-text");
      if (!currentText?.text?.trim()) return;

      const id = getProjectId();

      whiteboardApi.drawOnWhiteboard(id, currentText);
      mutateUpdatedAt(id);
    };

    input.addEventListener("blur", finish);

    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter") finish();
      else if (ev.key === "Escape") finish();
    });
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
