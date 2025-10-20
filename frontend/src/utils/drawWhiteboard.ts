import { drawDots } from "./drawDots";

type Props = {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const drawWhiteboard = ({ ctx, x, y, width, height }: Props) => {
  const radius = 20;

  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();

  drawDots({ ctx, width, height, offsetX: x, offsetY: y });
};
