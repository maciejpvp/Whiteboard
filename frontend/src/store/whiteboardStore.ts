import { create } from "zustand";
import type { InteractionMode } from "../types";

type WhiteboardState = {
  color: string;
  brushSize: number;
  textSize: number;
  tool: InteractionMode;
  setColor: (val: string) => void;
  setBrushSize: (val: number) => void;
  setTextSize: (val: number) => void;
  setTool: (val: InteractionMode) => void;
};

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  color: "#f00",
  brushSize: 15,
  textSize: 25,
  tool: "draw-line",
  setColor: (val) => set({ color: val }),
  setBrushSize: (val) => set({ brushSize: val }),
  setTextSize: (val) => set({ textSize: val }),
  setTool: (val: InteractionMode) => set({ tool: val }),
}));
