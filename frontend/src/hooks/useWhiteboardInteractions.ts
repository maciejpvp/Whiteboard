import { isCursorInsideWhiteboard } from "../utils/isCursorInsideWhiteboard";

type Props = {
  whiteboardRef: React.RefObject<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
};

export const useWhiteboardInteractions = ({ whiteboardRef }: Props) => {
  const onClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const insideWhiteboard = isCursorInsideWhiteboard(e, whiteboardRef);

    if (!insideWhiteboard) return;

    console.log(insideWhiteboard);
  };
  return onClick;
};
