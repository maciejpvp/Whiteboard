import { TextCursor } from "lucide-react";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useWhiteboardStore } from "../../../store/whiteboardStore";

export const TextPicker = () => {
  const size = useWhiteboardStore((store) => store.textSize);
  const setFontSize = useWhiteboardStore((store) => store.setTextSize);
  const [isOpen, setIsOpen] = useState(false);
  const color = useWhiteboardStore((store) => store.color);
  const pickerRef = useRef<HTMLDivElement>(null);

  const tool = useWhiteboardStore((store) => store.tool);
  const setTool = useWhiteboardStore((store) => store.setTool);

  const handleClick = () => {
    if (tool === "text") {
      setIsOpen((prev) => !prev);
      return;
    }
    setTool("text");
  };

  return (
    <div className="relative flex items-center">
      <button
        onClick={handleClick}
        aria-label="Select brush size"
        className="relative flex items-center justify-center p-2 rounded-full backdrop-blur-xl transition-all duration-150"
      >
        <span
          className={`absolute inset-0 rounded-full transition-opacity duration-150 pointer-events-none ${
            tool === "text"
              ? "opacity-100 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0.2)_0%,_rgba(0,0,0,0.1)_40%,_rgba(0,0,0,0)_100%)]"
              : "opacity-0"
          }`}
        />

        <TextCursor className="relative w-5 h-5 text-black z-10" />
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
                         z-50 flex flex-col items-center gap-4 transition-all duration-200"
            >
              <p className="text-sm font-semibold text-gray-700 select-none">
                Font Size{" "}
                <span className="font-bold italic underline">{size} px</span>
              </p>

              <input
                type="range"
                min={5}
                max={100}
                value={size}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-40 h-2 bg-gray-300 rounded-full appearance-none cursor-pointer transition-all duration-150 hover:h-3"
                style={{ accentColor: color }}
              />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};
