export const isCursorInsideWhiteboard = (
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  ref: React.RefObject<{ x: number; y: number; width: number; height: number }>,
): boolean => {
  const wb = ref.current;
  if (!wb) return false;
  const { x, y, width, height } = wb;
  return (
    e.clientX >= x &&
    e.clientX <= x + width &&
    e.clientY >= y &&
    e.clientY <= y + height
  );
};
