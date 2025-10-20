import { drawDots } from "./drawDots";

type Props = {
  ctx: CanvasRenderingContext2D;
  worldX: number;
  worldY: number;
  WORLD_SIZE_X: number;
  WORLD_SIZE_Y: number;
  zoom: number;
};

export const drawWhiteboard = ({
  ctx,
  worldX,
  worldY,
  WORLD_SIZE_X,
  WORLD_SIZE_Y,
  zoom,
}: Props) => {
  const x = worldX - (WORLD_SIZE_X / 2) * zoom;
  const y = worldY - (WORLD_SIZE_Y / 2) * zoom;
  const width = WORLD_SIZE_X * zoom;
  const height = WORLD_SIZE_Y * zoom;
  const radius = 20;

  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();

  drawDots({ ctx, width, height, offsetX: x, offsetY: y });
};
