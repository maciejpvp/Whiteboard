import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import Joi from "joi";
import { useCreateWhiteboard } from "@/hooks/api/mutations/useCreateWhiteboard";

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CreateWhiteboardModal = ({ open, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const { mutate } = useCreateWhiteboard();

  const handleCreate = async () => {
    if (Joi.string().min(1).max(60).required().validate(title).error) return;

    mutate(title);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            borderRadius: "16px",
          },
        },
      }}
    >
      <DialogTitle>Create new whiteboard</DialogTitle>

      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Whiteboard name"
          variant="standard"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleCreate} variant="contained" disableElevation>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};
