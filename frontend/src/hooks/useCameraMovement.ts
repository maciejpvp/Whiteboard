import { useEffect, useRef, useState } from "react";
import type { Coords } from "../types";

export const useCameraMovement = () => {
  const [camera, setCamera] = useState<Coords>({ x: 0, y: 0 });

  const startedCoords = useRef<Coords | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      startedCoords.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      startedCoords.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!startedCoords.current) return;
      const dx = e.clientX - startedCoords.current.x;
      const dy = e.clientY - startedCoords.current.y;
      setCamera((prev) => ({ x: prev.x - dx, y: prev.y - dy }));
      startedCoords.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return { camera, setCamera };
};
