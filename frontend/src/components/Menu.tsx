import { ColorPicker } from "./Menu/ColorPicker";
import { BrushSizePicker } from "./Menu/BrushSizePicker";

export const Menu = () => {
  return (
    <div
      className="absolute bottom-10 left-1/2 -translate-x-1/2
                 bg-gradient-to-br from-white/20 to-white/5
                 backdrop-blur-2xl backdrop-saturate-200
                 border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.05)]
                 rounded-3xl px-6 py-3 text-white/90
                 font-semibold tracking-wide
                 flex items-center gap-3
                 transition-all duration-500 hover:scale-105 hover:from-white/30 hover:to-white/10"
    >
      <BrushSizePicker />
      <ColorPicker />
    </div>
  );
};
