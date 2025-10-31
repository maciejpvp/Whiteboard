import axios from "axios";

import { useAuthStore } from "@/store/authStore";
import { API_URL } from "@/config/config";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const idToken = useAuthStore.getState().idToken;

  console.log("ID TOKEN IN CLIENT: ", idToken);

  if (config.skipAuth) {
    return config;
  }

  if (!idToken) {
    return Promise.reject(new axios.Cancel("Request aborted: No token"));
  }

  config.headers.Authorization = `Bearer ${idToken}`;

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;
