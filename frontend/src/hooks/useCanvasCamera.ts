import { useRef, useState, useEffect } from "react";

export const useCanvasCamera = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) => {
  const [cameraX, setCameraX] = useState(0);
  const [cameraY, setCameraY] = useState(0);
  const [cameraZoom, setCameraZoom] = useState(1);

  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const cameraStartX = useRef(0);
  const cameraStartY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseDown = (e: MouseEvent) => {
      return;
      isDragging.current = true;
      dragStartX.current = e.clientX;
      dragStartY.current = e.clientY;
      cameraStartX.current = cameraX;
      cameraStartY.current = cameraY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = (e.clientX - dragStartX.current) / cameraZoom;
      const dy = (e.clientY - dragStartY.current) / cameraZoom;
      setCameraX(cameraStartX.current - dx);
      setCameraY(cameraStartY.current - dy);
    };

    const handleMouseUp = () => (isDragging.current = false);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomIntensity = 0.2;
      setCameraZoom((prevZoom) => {
        const oldZoom = prevZoom;
        const delta = e.deltaY < 0 ? 1 : -1;
        const newZoom = Math.min(
          Math.max(oldZoom * (1 + delta * zoomIntensity), 0.3),
          2.5,
        );

        console.log(newZoom);

        const rect = canvas!.getBoundingClientRect();
        const cursorX = e.clientX - rect.left - canvas!.width / 2;
        const cursorY = e.clientY - rect.top - canvas!.height / 2;

        setCameraX((prevX) => {
          const worldX = prevX + cursorX / oldZoom;
          return worldX - cursorX / newZoom;
        });
        setCameraY((prevY) => {
          const worldY = prevY + cursorY / oldZoom;
          return worldY - cursorY / newZoom;
        });

        return newZoom;
      });
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, cameraX, cameraY, cameraZoom]);

  return { cameraX, cameraY, cameraZoom };
};
