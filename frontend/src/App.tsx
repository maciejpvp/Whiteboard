import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Whiteboard } from "./pages/Whiteboard";
import { ProjectsList } from "./pages/ProjectsList";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/project/:id" element={<Whiteboard />} />
        <Route path="/" element={<ProjectsList />} />
        <Route path="*" element={<Navigate to={"/"} />} />
      </Routes>
    </BrowserRouter>
  );
};
