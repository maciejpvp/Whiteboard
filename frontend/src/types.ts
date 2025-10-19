export type Point = { x: number; y: number };

export type LineElement = {
  type: "line";
  points: Point[];
  color: string;
  size: number;
};

export type ShapeElement = {
  type: "shape";
  shape: "circle" | "rectangle" | "triangle";
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  color: string;
  fill?: boolean;
  size?: number;
};

export type TextElement = {
  type: "text";
  x: number;
  y: number;
  text: string;
  color: string;
  fontSize: number;
  fontFamily?: string;
};

export type WhiteboardElement = LineElement | ShapeElement | TextElement;
export type WhiteboardData = WhiteboardElement[];

export type InteractionMode = "draw-line" | "draw-shape" | "text" | "none";

export type InteractionConfig =
  | {
      mode: "draw-line";
      color: string;
      size: number;
    }
  | {
      mode: "draw-shape";
      shape: "circle" | "rectangle" | "triangle";
      color: string;
      size?: number;
      fill?: boolean;
    }
  | {
      mode: "text";
      color: string;
      fontSize: number;
      text: string;
      fontFamily?: string;
    }
  | {
      mode: "none";
    };

export type Coords = {
  x: number;
  y: number;
};
