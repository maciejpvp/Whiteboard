type Props = {
  ctx: CanvasRenderingContext2D;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export const drawDots = ({ ctx, width, height, offsetX, offsetY }: Props) => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  const spacing = 20;

  for (let x = offsetX; x < width + offsetX; x += spacing) {
    for (let y = offsetY; y < height + offsetY; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
};
