import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Whiteboard } from "@/pages/Whiteboard";
import { ProjectsList } from "@/pages/ProjectsList";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { LoginPage } from "./pages/login";
import { CallbackPage } from "./pages/callback";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useWebSocketStore } from "./store/wsStore";
import { websocketUrl } from "./constants/ws";

export const App = () => {
  const login = useAuthStore((store) => store.login);
  const idToken = useAuthStore((store) => store.idToken);

  const connectWS = useWebSocketStore((store) => store.connect);
  const disconnectWS = useWebSocketStore((store) => store.disconnect);
  const isConnected = useWebSocketStore((store) => store.connected);

  useEffect(() => {
    login();

    const refreshId = setTimeout(
      () => {
        login();
      },
      59 * 60 * 1000, // 59 Min
    );

    return () => {
      clearTimeout(refreshId);
    };
    // login() is unneceserry to store in dependencies array
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!idToken) return;
    if (isConnected) return;

    connectWS(websocketUrl());

    return () => {
      disconnectWS();
    };
  }, [idToken, isConnected]);

  if (!idToken) return null;

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/project/:id" element={<Whiteboard />} />
          <Route path="/" element={<ProjectsList />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="*" element={<Navigate to={"/"} />} />
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
