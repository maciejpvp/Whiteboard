export type Point = { x: number; y: number };

export type LineElement = {
  id: string;
  type: "line";
  points: Point[];
  color: string;
  size: number;
};

export type TextElement = {
  id: string;
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  fontFamily?: string;
};

export type WhiteboardElement = LineElement | TextElement;
export type WhiteboardData = WhiteboardElement[];

export type WhiteboardItemShareToItemType = {
  userId: string;
  access: "read" | "write";
};

export type WhiteboardItemType = {
  UserId: string;
  WhiteboardId: string;
  name: string;
  data: WhiteboardData;
  createdAt: Date;
  shareTo?: WhiteboardItemShareToItemType[];
};
