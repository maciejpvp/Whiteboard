import { whiteboardApi } from "@/api/whiteboard";
import { Navbar } from "../components/ProjectsList/Navbar";
import { useEffect, useState } from "react";

export const ProjectsList = () => {
  const [list, setList] = useState([]);

  console.log(list);

  useEffect(() => {
    (async () => {
      const response = await whiteboardApi.getList();

      const data = response.data?.data.items || [];

      setList(data);
    })();
  }, []);

  return (
    <div className="w-dvw h-dvh bg-slate-100">
      <Navbar />
    </div>
  );
};
