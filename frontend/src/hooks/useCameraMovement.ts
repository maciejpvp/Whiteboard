import { useEffect, useRef, type RefObject } from "react";
import type { Coords } from "../types";

type Props = {
  zoom: RefObject<number>;
};

export const useCameraMovement = ({ zoom }: Props) => {
  const cameraRef = useRef<Coords>({ x: 0, y: 0 });
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
      const dx = (e.clientX - startedCoords.current.x) / zoom.current;
      const dy = (e.clientY - startedCoords.current.y) / zoom.current;
      cameraRef.current = {
        x: cameraRef.current.x - dx,
        y: cameraRef.current.y - dy,
      };
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
    const targetElement = document.body;

    const handleSpacePressed = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressedRef.current = true;
        targetElement.classList.add("cursor-grab");
      }
    };
    const handleSpaceReleased = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        isSpacePressedRef.current = false;
        targetElement.classList.remove("cursor-grab");
      }
    };

    window.addEventListener("keydown", handleSpacePressed);
    window.addEventListener("keyup", handleSpaceReleased);

    return () => {
      window.removeEventListener("keydown", handleSpacePressed);
      window.removeEventListener("keyup", handleSpaceReleased);
    };
  }, []);

  return cameraRef;
};
