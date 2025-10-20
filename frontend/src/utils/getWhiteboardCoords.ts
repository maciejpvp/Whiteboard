export const getWhiteboardCoords = (
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ref: React.RefObject<{ x: number; y: number; width: number; height: number }>,
  WORLD_SIZE_X: number,
  WORLD_SIZE_Y: number,
): { x: number; y: number } => {
  const wb = ref.current;
  if (!wb) return { x: 0, y: 0 };

  const x = ((e.clientX - wb.x) / wb.width) * WORLD_SIZE_X;
  const y = ((e.clientY - wb.y) / wb.height) * WORLD_SIZE_Y;

  return { x, y };
};
