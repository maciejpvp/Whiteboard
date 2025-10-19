import { useEffect, useState } from "react";

export const useCameraZoom = () => {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      setZoom((prev) => {
        const newZoom = prev * (e.deltaY > 0 ? 0.9 : 1.1);
        return Math.min(Math.max(newZoom, 0.2), 5);
      });
    };

    document.addEventListener("wheel", handleWheel);

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return { zoom, setZoom };
};
