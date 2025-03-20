// ./components/Snackbar/SnackbarComponent.tsx

import { SnackbarContent, IconButton, Box } from "@mui/material";

// Couleurs MUI
import { green, amber } from "@mui/material/colors";

// Icônes
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";

type VariantType = "success" | "warning" | "error" | "info";

interface ISnackbarComponentProps {
  message: string;
  variant: VariantType;
  onClose: () => void;
  /** Optionnel si vous souhaitez ajouter une marge ou un style personnalisé */
  className?: string;
}

// Mapping des icônes par variant
const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

// Styles spécifiques selon le variant
const variantStyles = {
  success: {
    backgroundColor: green[600],
    maxWidth: "100%",
  },
  error: {
    // On peut utiliser directement la palette MUI, 
    // ou simplement "red", etc.
    backgroundColor: "error.dark",
    maxWidth: "100%",
  },
  info: {
    backgroundColor: "primary.dark",
    maxWidth: "100%",
  },
  warning: {
    backgroundColor: amber[700],
    maxWidth: "100%",
  },
};

/**
 * SnackbarComponent : une Snackbar custom
 * - Conserve l'apparence (icône + texte) 
 * - Quatre variants : success, error, info, warning
 */
export default function SnackbarComponent(props: ISnackbarComponentProps) {
  const { message, variant, onClose, className } = props;

  // Choix de l'icône en fonction du variant
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      // On applique le style selon le variant
      sx={{
        ...variantStyles[variant],
      }}
      className={className} // si besoin d'ajouter un style externe
      aria-describedby="client-snackbar"
      message={
        <Box 
          id="client-snackbar"
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Icon 
            sx={{
              fontSize: 20,
              opacity: 0.9,
              marginRight: 1,
            }} 
          />
          {message}
        </Box>
      }
      action={
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={onClose}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      }
    />
  );
}
