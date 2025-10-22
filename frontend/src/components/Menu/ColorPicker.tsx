import { useState } from "react";
import { createPortal } from "react-dom";
import { HexColorPicker } from "react-colorful";
import { useWhiteboardStore } from "../../store/whiteboardStore";

export const ColorPicker = () => {
  const [showPicker, setShowPicker] = useState(false);
  const color = useWhiteboardStore((store) => store.color);
  const setColor = useWhiteboardStore((store) => store.setColor);

  return (
    <div className="relative">
      <button
        onClick={() => setShowPicker(true)}
        className="w-6 h-6 rounded-full border border-white/30 shadow-inner"
        style={{ backgroundColor: color }}
      />

      {showPicker &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-transparent z-40"
              onClick={() => setShowPicker(false)}
            />

            <div
              className="fixed bottom-20 left-1/2 -translate-x-1/2
                         bg-white p-3 rounded-2xl shadow-xl border border-gray-200
                         z-50 bg-white/80"
            >
              <HexColorPicker color={color} onChange={setColor} />
            </div>
          </>,
          document.body,
        )}
    </div>
  );
};
