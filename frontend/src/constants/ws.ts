import { WS_URL } from "@/config/config";
import { useAuthStore } from "@/store/authStore";

export const websocketUrl = () => {
  const token = useAuthStore.getState().idToken;

  return `${WS_URL}?Authorization=${token}`;
};
