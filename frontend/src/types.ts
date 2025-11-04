export type UserType = {
  name: string;
  email: string;
  avatar: string;
  fullname: string;
  surname: string;
};

export type ItemType = {
  Title: string;
  WhiteboardId: string;
};

export type ListType = ItemType[];

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

export type MessageMap = {
  WHITEBOARD_DATA_UPDATE: {
    whiteboardId: string;
    newObject: unknown;
  };
};

export type WebSocketMessage<T extends keyof MessageMap = keyof MessageMap> = {
  type: T;
  payload: MessageMap[T];
};
