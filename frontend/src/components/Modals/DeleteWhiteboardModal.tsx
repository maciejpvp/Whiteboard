import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useDeleteWhiteboard } from "@/hooks/api/mutations/useDeleteWhiteboard";

type Props = {
  open: boolean;
  onClose: () => void;
  whiteboardId: string;
  whiteboardName: string;
};

export const DeleteWhiteboardModal = ({
  open,
  onClose,
  whiteboardId,
  whiteboardName,
}: Props) => {
  const [confirmName, setConfirmName] = useState("");
  const { mutate, isPending } = useDeleteWhiteboard();

  const handleDelete = () => {
    if (confirmName !== whiteboardName) return;
    mutate(whiteboardId, {
      onSuccess: () => console.log("1"),
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "20px",
            p: 3,
          },
        },
      }}
    >
      <DialogTitle
        fontWeight="bold"
        fontSize="1.25rem"
        display="flex"
        alignItems="center"
        gap={1}
      >
        <WarningAmberIcon color="error" />
        Delete Whiteboard
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography>
            This action is permanent. To confirm, type: <b>{whiteboardName}</b>
          </Typography>

          <TextField
            autoFocus
            fullWidth
            label="Type the whiteboard name"
            variant="outlined"
            value={confirmName}
            disabled={isPending}
            onChange={(e) => setConfirmName(e.target.value)}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ pt: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disableElevation
          disabled={confirmName !== whiteboardName || isPending}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};
