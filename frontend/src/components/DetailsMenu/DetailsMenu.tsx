// ./components/DetailsMenu/DetailsMenu.tsx
import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import InfoIcon from "@mui/icons-material/Info";

interface IProps {
  title: string;
  size: string;
  description: string;
  allergies: string[];
  onClose: () => void;
}

const DetailsMenu: React.FC<IProps> = ({
  title,
  size,
  description,
  allergies,
  onClose
}) => {
  return (
    <Dialog
      maxWidth="md"
      open
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemAvatar>
              <InfoIcon />
            </ListItemAvatar>
            <ListItemText primary="Taille" secondary={size || "/"} />
          </ListItem>
          <Divider variant="middle" />
          <ListItem>
            <ListItemAvatar>
              <InfoIcon />
            </ListItemAvatar>
            <ListItemText primary="Description" secondary={description || "/"} />
          </ListItem>
          <Divider variant="middle" />
          <ListItem>
            <ListItemAvatar>
              <BugReportIcon />
            </ListItemAvatar>
            <ListItemText
              primary="Allergènes"
              secondary={
                allergies && allergies.length > 0
                  ? allergies.join(", ")
                  : "/"
              }
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DetailsMenu;
