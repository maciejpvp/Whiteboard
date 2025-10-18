import { Canvas } from "./components/Canvas";
import { CanvasWrapper } from "./components/CanvasWrapper";

export const App = () => {
  return (
    <div className="w-dvw h-dvh bg-zinc-100 flex justify-center items-center">
      <CanvasWrapper>
        <Canvas />
      </CanvasWrapper>
    </div>
  );
};
