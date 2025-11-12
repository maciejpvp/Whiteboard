import { WhiteboardElement } from "@/types";
import apiClient from "./client";

export const whiteboardApi = {
  getList: () => apiClient.get("/whiteboard"),
  getItem: (id: string) => apiClient.get(`/whiteboard/${id}`),
  getSharedItem: (id: string, ownerId: string) =>
    apiClient.get(`/whiteboard/shared/${ownerId}/${id}`),
  createProject: (name: string) =>
    apiClient.post("/whiteboard", {
      name,
    }),
  drawOnWhiteboard: (
    id: string,
    newObject: WhiteboardElement,
    ownerId: string,
  ) =>
    apiClient.post(`/whiteboard/draw/${id}`, {
      newObject,
      ownerId,
    }),
  shareWhiteboard: (id: string, email: string, access: "read" | "write") =>
    apiClient.post(`/whiteboard/share/${id}`, {
      email,
      access,
    }),

  createWhiteboard: (id: string, name: string) =>
    apiClient.post("/whiteboard", {
      id,
      name,
    }),

  editWhiteboard: (id: string, name: string) =>
    apiClient.post("/whiteboard", {
      id,
      name,
    }),

  deleteWhiteboard: (id: string) => apiClient.delete(`/whiteboard/${id}`),
};
