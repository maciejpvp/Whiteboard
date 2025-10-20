import { getWhiteboardCoords } from "../utils/getWhiteboardCoords";
import { isCursorInsideWhiteboard } from "../utils/isCursorInsideWhiteboard";

type Props = {
  whiteboardRef: React.RefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  WORLD_SIZE_X: number;
  WORLD_SIZE_Y: number;
};

export const useWhiteboardInteractions = ({
  whiteboardRef,
  WORLD_SIZE_X,
  WORLD_SIZE_Y,
}: Props) => {
  const onClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const insideWhiteboard = isCursorInsideWhiteboard(e, whiteboardRef);

    if (!insideWhiteboard) return;

    const { x, y } = getWhiteboardCoords(
      e,
      whiteboardRef,
      WORLD_SIZE_X,
      WORLD_SIZE_Y,
    );

    console.log(x, y);
  };
  return onClick;
};
