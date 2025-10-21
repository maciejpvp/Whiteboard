import { useEffect, useRef, type RefObject } from "react";
import type { Coords } from "../types";

type Props = {
  zoom: RefObject<number>;
  isSpacePressedRef: RefObject<boolean>;
};

export const useCameraMovement = ({ zoom, isSpacePressedRef }: Props) => {
  const cameraRef = useRef<Coords>({ x: 0, y: 0 });
  const startedCoords = useRef<Coords | null>(null);

  const handleMouseDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isSpacePressedRef.current) return;
    startedCoords.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    startedCoords.current = null;
  };

  const handleMouseMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!startedCoords.current) return;
    const dx = (e.clientX - startedCoords.current.x) / zoom.current;
    const dy = (e.clientY - startedCoords.current.y) / zoom.current;
    cameraRef.current = {
      x: cameraRef.current.x - dx,
      y: cameraRef.current.y - dy,
    };
    startedCoords.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      // 1 is middle click
      if (event.button === 1) {
        startedCoords.current = { x: event.clientX, y: event.clientY };
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSpacePressedRef]);

  return { cameraRef, handleMouseDown, handleMouseMove, handleMouseUp };
};
