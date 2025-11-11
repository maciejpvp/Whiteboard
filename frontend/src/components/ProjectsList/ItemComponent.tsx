import { Box, Typography, Menu, MenuItem, IconButton } from "@mui/material";
import { ItemType } from "@/types";
import { useNavigate } from "react-router-dom";
import { Clock, MoreVertical } from "lucide-react";
import { useState } from "react";
import { ShareWhiteboardModal } from "../Modals/ShareWhiteboardModal";
import { DeleteWhiteboardModal } from "../Modals/DeleteWhiteboardModal";
import { timeAgo } from "@/utils/timeAgo";

type Props = {
  item: ItemType;
};

export const ItemComponent = ({ item }: Props) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const open = Boolean(anchorEl);

  const lastOpened = timeAgo(item.updatedAt);

  const handleShareProject = () => {
    setShareOpen(true);
  };

  const handleEditName = () => {};
  const handleDelete = () => {
    setDeleteOpen(true);
  };

  return (
    <>
      <Box
        className="
      relative group
      cursor-pointer transition-all duration-200
      bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-5
      hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.99]
      flex flex-col justify-between h-[170px]
    "
        onClick={() => navigate(`/project/${item.WhiteboardId}`)}
      >
        <div className="flex justify-between items-start">
          <Typography
            variant="h6"
            className="font-semibold text-slate-900 truncate mb-2"
          >
            {item.Title || "Untitled Whiteboard"}
          </Typography>

          {!item.shared && (
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setAnchorEl(e.currentTarget);
              }}
              className="opacity-0 group-hover:opacity-100 transition"
            >
              <MoreVertical size={18} />
            </IconButton>
          )}
        </div>
        <div className="flex items-center text-slate-500 text-sm gap-1">
          <Clock size={16} className="text-slate-400" />
          <span>Last opened: {lastOpened}</span>
        </div>
      </Box>

      {/* MENU */}
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(null);
            handleShareProject();
          }}
        >
          Share
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(null);
            handleEditName();
          }}
        >
          Edit Name
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setAnchorEl(null);
            handleDelete();
          }}
          className="text-red-600"
        >
          Delete
        </MenuItem>
      </Menu>

      {/* SHARE MODAL */}
      <ShareWhiteboardModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        whiteboardId={item.WhiteboardId}
        sharedList={item.shareTo ?? []}
      />
      <DeleteWhiteboardModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        whiteboardId={item.WhiteboardId}
        whiteboardName={item.Title}
      />
    </>
  );
};
