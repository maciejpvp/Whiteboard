import { create } from "zustand";

type WebSocketPayload = {
  type: string;
  payload: any;
};

type EventCallbacks = {
  [type: string]: ((payload: any) => void)[];
};

type WebSocketStore = {
  ws: WebSocket | null;
  connected: boolean;
  events: EventCallbacks;

  connect: (url: string) => void;
  disconnect: () => void;
  on: (type: string, callback: (payload: any) => void) => void;
  off: (type: string, callback: (payload: any) => void) => void;
  send: (type: string, payload: string) => void;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  ws: null,
  connected: false,
  events: {},

  connect: (url: string) => {
    if (get().ws) return; // already connected

    const ws = new WebSocket(url);

    ws.onopen = () => {
      set({ connected: true });
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      try {
        console.log(event.data);
        const data: WebSocketPayload = JSON.parse(event.data);
        const callbacks = get().events[data.type] || [];

        callbacks.forEach((cb) => cb(data.payload));
      } catch (err) {
        console.error("Invalid message", err);
      }
    };

    ws.onclose = () => {
      set({ connected: false, ws: null });
      console.log("WebSocket disconnected");
    };

    set({ ws });
  },

  disconnect: () => {
    const ws = get().ws;
    if (ws) {
      ws.close();
      set({ ws: null, connected: false });
    }
  },

  on: (type: string, callback: (payload: any) => void) => {
    const events = { ...get().events };

    if (!events[type]) events[type] = [];
    events[type].push(callback);
    set({ events });
  },

  off: (type: string, callback: (payload: any) => void) => {
    const events = { ...get().events };

    if (!events[type]) return;
    events[type] = events[type].filter((cb) => cb !== callback);
    set({ events });
  },

  send: (type: string, payload: any) => {
    const ws = get().ws;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }));
    }
  },
}));
