import { MessageMap, WebSocketMessage } from "@/types";
import { create } from "zustand";

type EventCallbacks = {
  [K in keyof MessageMap]?: ((payload: MessageMap[K]) => void)[];
};

type WebSocketStore = {
  ws: WebSocket | null;
  connected: boolean;
  events: EventCallbacks;

  connect: (url: string) => void;
  disconnect: () => void;
  on: <T extends keyof MessageMap>(
    type: T,
    callback: (payload: MessageMap[T]) => void,
  ) => void;
  off: <T extends keyof MessageMap>(
    type: T,
    callback: (payload: MessageMap[T]) => void,
  ) => void;
  send: <T extends keyof MessageMap>(type: T, payload: MessageMap[T]) => void;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  ws: null,
  connected: false,
  events: {},

  connect: (url) => {
    if (get().ws) return;

    const ws = new WebSocket(url);

    ws.onopen = () => set({ connected: true });
    ws.onclose = () => set({ connected: false, ws: null });

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        const callbacks = get().events[data.type] || [];
        callbacks.forEach((cb) => cb(data.payload));
      } catch (err) {
        console.error("Invalid WS message", err);
      }
    };

    console.log("Connected");

    set({ ws });
  },

  disconnect: () => {
    get().ws?.close();
    set({ ws: null, connected: false });
  },

  on: (type, callback) => {
    set((state) => ({
      events: {
        ...state.events,
        [type]: [...(state.events[type] || []), callback],
      },
    }));
  },

  off: (type, callback) => {
    set((state) => ({
      events: {
        ...state.events,
        [type]: (state.events[type] || []).filter((cb) => cb !== callback),
      },
    }));
  },

  send: (type, payload) => {
    const ws = get().ws;
    if (ws && ws.readyState === WebSocket.OPEN) {
      const msg: WebSocketMessage<typeof type> = { type, payload };
      ws.send(JSON.stringify(msg));
    }
  },
}));
