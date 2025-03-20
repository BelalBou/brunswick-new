// ./components/SnackbarAction/SnackbarAction.tsx
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { green } from "@mui/material/colors";

interface SnackbarActionProps {
  success?: boolean;
  error?: boolean;
  message: React.ReactNode;
  onClose?: () => void;
}

export default function SnackbarAction(props: SnackbarActionProps) {
  const theme = useTheme();
  const { success, error, message, onClose } = props;

  // Détermine la couleur de fond en fonction du variant
  const backgroundColor = success
    ? green[600]
    : error
    ? theme.palette.error.dark
    : theme.palette.primary.main;

  return (
    <Snackbar
      open
      autoHideDuration={2500}
      onClose={onClose}
      ContentProps={{
        sx: {
          backgroundColor,
        },
      }}
      message={<span id="message-id">{message}</span>}
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          sx={{ p: theme.spacing(0.5) }}
          onClick={onClose}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>,
      ]}
    />
  );
}
