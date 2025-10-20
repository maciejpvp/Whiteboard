import { useEffect, useRef, useState } from "react";
import type { Coords } from "../types";

type Props = {
  zoom: number;
};

export const useCameraMovement = ({ zoom }: Props) => {
  const [camera, setCamera] = useState<Coords>({ x: 0, y: 0 });
  const isSpacePressedRef = useRef<boolean>(false);

  const startedCoords = useRef<Coords | null>(null);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!isSpacePressedRef.current) return;
      startedCoords.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      startedCoords.current = null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!startedCoords.current) return;
      const dx = (e.clientX - startedCoords.current.x) / zoom;
      const dy = (e.clientY - startedCoords.current.y) / zoom;
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
  }, [zoom]);

  useEffect(() => {
    const handleSpacePressed = (e: KeyboardEvent) => {
      if (e.code === "Space") isSpacePressedRef.current = true;
    };
    const handleSpaceReleased = (e: KeyboardEvent) => {
      if (e.code === "Space") isSpacePressedRef.current = false;
    };

    window.addEventListener("keydown", handleSpacePressed);
    window.addEventListener("keyup", handleSpaceReleased);

    return () => {
      window.removeEventListener("keydown", handleSpacePressed);
      window.removeEventListener("keyup", handleSpaceReleased);
    };
  }, []);

  return { camera, setCamera };
};
