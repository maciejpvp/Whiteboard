import { WhiteboardElement } from "@/types";
import apiClient from "./client";

export const whiteboardApi = {
  getList: () => apiClient.get("/whiteboard"),
  getItem: (id: string) => apiClient.get(`/whiteboard/${id}`),
  createProject: (name: string) =>
    apiClient.post("/whiteboard", {
      name,
    }),
  drawOnWhiteboard: (id: string, newObject: WhiteboardElement) =>
    apiClient.post(`/whiteboard/draw/${id}`, {
      newObject,
    }),
};
