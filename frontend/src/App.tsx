import { Canvas } from "./components/Canvas";
import { CanvasWrapper } from "./components/CanvasWrapper";
import { Menu } from "./components/Menu";

export const App = () => {
  return (
    <div className="w-dvw h-dvh bg-zinc-100 flex justify-center items-center">
      <CanvasWrapper>
        <Canvas />
      </CanvasWrapper>
      <Menu />
    </div>
  );
};
