import { Canvas } from "../components/Whiteboard/Canvas";
import { CanvasWrapper } from "../components/Whiteboard/CanvasWrapper";
import { Menu } from "../components/Whiteboard/Menu";

export const Whiteboard = () => {
  return (
    <div className="w-dvw h-dvh bg-zinc-100 flex justify-center items-center">
      <CanvasWrapper>
        <Canvas />
      </CanvasWrapper>
      <Menu />
    </div>
  );
};
