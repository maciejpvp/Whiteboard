import { useEffect, useRef } from "react";

export const useCameraZoom = () => {
  const zoomRef = useRef(1);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const newZoom = zoomRef.current * (e.deltaY > 0 ? 0.9 : 1.1);
      zoomRef.current = Math.min(Math.max(newZoom, 0.2), 5);
    };

    document.addEventListener("wheel", handleWheel);

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return zoomRef;
};
