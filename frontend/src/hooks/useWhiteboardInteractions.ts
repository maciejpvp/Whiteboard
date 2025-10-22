import { useRef } from "react";
import { useWhiteboardStore } from "../store/whiteboardStore";
import type { LineElement, WhiteboardData } from "../types";
import { brush } from "../utils/tools/brush";
import { textTool } from "../utils/tools/text";

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
  dataRef: React.RefObject<WhiteboardData>;
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
  const tool = useWhiteboardStore((store) => store.tool);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isSpacePressedRef.current) return;

    if (tool === "draw-line") {
      brush.onPointerDown({
        e,
        whiteboardRef,
        WORLD_SIZE_X,
        WORLD_SIZE_Y,
        dataRef,
        newEntryRef,
        isClickedRef,
      });
    }

    if (tool === "text") {
      textTool.onPointerDown({
        e,
        whiteboardRef,
        WORLD_SIZE_X,
        WORLD_SIZE_Y,
        dataRef,
      });
    }
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (tool === "draw-line") {
      brush.onPointerMove({
        e,
        whiteboardRef,
        WORLD_SIZE_X,
        WORLD_SIZE_Y,
        dataRef,
        newEntryRef,
        isClickedRef,
      });
    }
  };

  const onPointerUp = () => {
    if (tool === "draw-line") {
      brush.onPointerUp(isClickedRef, newEntryRef);
    }
  };

  return { onPointerDown, onPointerMove, onPointerUp };
};
