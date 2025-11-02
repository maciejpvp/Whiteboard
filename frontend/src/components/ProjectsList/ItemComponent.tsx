import { Box, Typography } from "@mui/material";
import { ItemType } from "@/types";
import { useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";

type Props = {
  item: ItemType;
};

export const ItemComponent = ({ item }: Props) => {
  const navigate = useNavigate();

  const randomDate = new Date(
    Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000,
  ).toLocaleDateString();

  return (
    <Box
      onClick={() => navigate(`/project/${item.WhiteboardId}`)}
      className="
        cursor-pointer transition-all duration-200
        bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-5
        hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]
        flex flex-col justify-between h-[170px]
      "
    >
      <div>
        <Typography
          variant="h6"
          className="font-semibold text-slate-900 truncate mb-2"
        >
          {item.Title || "Untitled Whiteboard"}
        </Typography>
      </div>
      <div className="flex items-center text-slate-500 text-sm gap-1">
        <Clock size={16} className="text-slate-400" />
        <span>Last opened: {randomDate}</span>
      </div>
    </Box>
  );
};
