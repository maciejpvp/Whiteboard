import { Pencil } from "lucide-react";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useWhiteboardStore } from "../../store/whiteboardStore";

export const BrushSizePicker = () => {
  const size = useWhiteboardStore((store) => store.brushSize);
  const setSize = useWhiteboardStore((store) => store.setBrushSize);
  const [isOpen, setIsOpen] = useState(false);
  const color = useWhiteboardStore((store) => store.color);
  const pickerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center p-2"
        aria-label="Select brush size"
      >
        <Pencil className="w-5 h-5 text-black" />
      </button>

      {isOpen &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-transparent z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Picker */}
            <div
              ref={pickerRef}
              className="fixed bottom-24 left-1/2 -translate-x-1/2
                         bg-white p-5 rounded-3xl shadow-2xl border border-gray-200
                         z-50 flex flex-col items-center gap-4 transition-all duration-200 pb-10"
            >
              <p className="text-sm font-semibold text-gray-700 select-none">
                Brush Size
              </p>

              <input
                type="range"
                min={5}
                max={15}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-40 h-2 bg-gray-300 rounded-full appearance-none cursor-pointer transition-all duration-150 hover:h-3"
                style={{ accentColor: color }}
              />

              <div
                className="rounded-full bg-black transition-all duration-150 absolute"
                style={{
                  width: size,
                  height: size,
                  bottom: 20 - size / 2,
                  background: color,
                }}
              />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};
