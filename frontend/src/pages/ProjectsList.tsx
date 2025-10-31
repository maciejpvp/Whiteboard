import { whiteboardApi } from "@/api/whiteboard";
import { Navbar } from "../components/ProjectsList/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type ItemType = {
  Title: string;
  WhiteboardId: string;
};

type ListType = ItemType[];

export const ProjectsList = () => {
  const navigate = useNavigate();
  const [list, setList] = useState<ListType>([]);

  console.log(list);

  useEffect(() => {
    (async () => {
      const response = await whiteboardApi.getList();

      const data: ListType = response.data?.data.items || [];

      console.log(data);

      setList(data);
    })();
  }, []);

  return (
    <div className="w-dvw h-dvh bg-slate-100">
      <Navbar />
      <ul>
        {list.map((item) => {
          return (
            <button onClick={() => navigate(`project/${item.WhiteboardId}`)}>
              {item.Title}
            </button>
          );
        })}
      </ul>
    </div>
  );
};
