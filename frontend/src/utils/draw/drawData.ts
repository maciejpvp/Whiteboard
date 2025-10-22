import type { WhiteboardData, WhiteboardElement } from "../../types";
import { brush } from "../tools/brush";
import { textTool } from "../tools/text";

type DrawDataProps = {
  ctx: CanvasRenderingContext2D;
  data: WhiteboardData;
  whiteboardRef: React.RefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  zoom: number;
};

export const drawData = ({ ctx, data, whiteboardRef, zoom }: DrawDataProps) => {
  if (!data) return;

  data.forEach((el: WhiteboardElement) => {
    switch (el.type) {
      case "line":
        brush.drawData(ctx, [el], whiteboardRef, zoom);
        break;

      case "text":
        textTool.drawData(ctx, [el], whiteboardRef, zoom);
        break;

      // case "shape":
      //   shapeTool.drawData(ctx, [el], whiteboardRef, zoom);
      //   break;

      default:
        break;
    }
  });
};
