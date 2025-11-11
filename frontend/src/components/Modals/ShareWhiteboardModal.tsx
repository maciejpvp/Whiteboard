import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
} from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import Joi from "joi";
import { ShareToItem } from "@/types";
import { useShareWhiteboard } from "@/hooks/api/mutations/useShareWhiteboard";

type Props = {
  open: boolean;
  onClose: () => void;
  whiteboardId: string;
  sharedList: ShareToItem[];
};

export const ShareWhiteboardModal = ({
  open,
  onClose,
  whiteboardId,
  sharedList,
}: Props) => {
  const [recipient, setRecipient] = useState("");
  const { mutate, isPending } = useShareWhiteboard();

  const handleShare = () => {
    const schema = Joi.string()
      .email({ tlds: { allow: false } })
      .required();
    if (schema.validate(recipient).error) return;

    mutate({
      id: whiteboardId,
      email: recipient,
      access: "read",
    });
    setRecipient("");
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
      <DialogTitle fontWeight="bold" fontSize="1.25rem">
        Share Whiteboard
      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus
            fullWidth
            label="Recipient email"
            variant="outlined"
            value={recipient}
            disabled={isPending}
            onChange={(e) => setRecipient(e.target.value)}
          />

          <Typography variant="subtitle1" color="textSecondary">
            Already shared with:
          </Typography>

          <Box
            sx={{
              maxHeight: 200,
              overflowY: "auto",
              border: "1px solid #e0e0e0",
              borderRadius: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: sharedList.length === 0 ? "center" : "flex-start",
              p: sharedList.length === 0 ? 3 : 0,
            }}
          >
            <List dense sx={{ width: "100%" }}>
              {sharedList.length === 0 ? (
                <ListItem
                  sx={{
                    flexDirection: "column",
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  <PersonOffIcon sx={{ fontSize: 40, mb: 1 }} />
                  <ListItemText primary="No users yet" />
                </ListItem>
              ) : (
                sharedList.map((user) => (
                  <ListItem key={user.userId} divider>
                    <ListItemText
                      primary={user.userId}
                      secondary={
                        user.access === "write" ? "Can edit" : "Read only"
                      }
                    />
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ pt: 2 }}>
        <Button onClick={onClose} color="inherit" disabled={isPending}>
          Cancel
        </Button>
        <Button
          onClick={handleShare}
          variant="contained"
          disableElevation
          disabled={isPending}
        >
          Share
        </Button>
      </DialogActions>
    </Dialog>
  );
};
