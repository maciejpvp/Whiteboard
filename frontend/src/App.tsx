import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Whiteboard } from "@/pages/Whiteboard";
import { ProjectsList } from "@/pages/ProjectsList";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { LoginPage } from "./pages/login";
import { CallbackPage } from "./pages/callback";

export const App = () => {
  const login = useAuthStore((store) => store.login);
  const idToken = useAuthStore((store) => store.idToken);

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

  if (!idToken) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/project/:id" element={<Whiteboard />} />
        <Route path="/" element={<ProjectsList />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/callback" element={<CallbackPage />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </BrowserRouter>
  );
};
