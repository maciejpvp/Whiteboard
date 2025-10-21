import { create } from "zustand";

type WhiteboardState = {
  color: string;
  brushSize: number;
  setColor: (val: string) => void;
  setBrushSize: (val: number) => void;
};

export const useWhiteboardStore = create<WhiteboardState>((set) => ({
  color: "#f00",
  brushSize: 5,
  setColor: (val) => set({ color: val }),
  setBrushSize: (val) => set({ brushSize: val }),
}));
