// ./components/AddCart/AddCart.tsx
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,    
  DialogActions,
  Button,
  Typography,
  Grid,
  IconButton,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BugReportIcon from "@mui/icons-material/BugReport";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";
import extraSort from "../../utils/ExtraSort/ExtraSort";
import { allergySort } from "../../utils/AllergySort/AllergySort";
import { S3_BASE_URL } from "../../utils/S3Utils/S3Utils";

interface AddCartProps {
  menu: IMenu;
  menus: IMenu[];
  userLanguage: string;
  onAdd: (item: ICart) => void;
  onClose: () => void;
  checkDictionnary: (tag: string) => string;
}

export default function AddCart(props: AddCartProps) {
  const { menu, menus, userLanguage, onAdd, onClose, checkDictionnary } = props;

  const [currentMenu, setCurrentMenu] = useState<IMenu>(menu);
  const [currentMenuId, setCurrentMenuId] = useState<number>(menu.id);
  const [quantity, setQuantity] = useState<number>(1);
  const [extras, setExtras] = useState<IExtra[]>([]);

  const handleRemoveQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleChangeSize = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    const newId = parseInt(value);
    const newMenu = menus.find((m) => m.id === newId);
    if (newMenu) {
      setCurrentMenu(newMenu);
      setCurrentMenuId(newId);
      setExtras([]);
    }
  };

  const handleChangeExtra = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    const extraId = parseInt(event.target.value);
    let updatedExtras = [...extras];
    if (checked) {
      const extraItem = currentMenu.Extra.find((x) => x.id === extraId);
      if (extraItem) {
        updatedExtras.push(extraItem);
      }
    } else {
      updatedExtras = updatedExtras.filter((x) => x.id !== extraId);
    }
    setExtras(updatedExtras);
  };

  const calculateTotalExtras = (): number =>
    extras.reduce((sum, extra) => sum + parseFloat(extra.pricing), 0);

  const totalPricing =
    quantity * parseFloat(currentMenu.pricing) + quantity * calculateTotalExtras();

  return (
    <Dialog
      open
      scroll="body"
      maxWidth="xs"
      onClose={onClose}
      aria-labelledby="form-dialog-title"
      sx={{
        "& .MuiDialog-paperScrollBody": {
          m: 3,
          "@media (min-width: md)": {
            m: 6,
            maxWidth: "400px",
          },
        },
      }}
    >
      <DialogTitle id="form-dialog-title" sx={{ textAlign: "center" }}>
        <Box
          component="img"
          src={
            currentMenu.picture
              ? `${S3_BASE_URL}/${currentMenu.picture}`
              : placeHolderIcon
          }
          alt="menu"
          sx={{
            width: { xs: "192px", md: "256px" },
            borderRadius: "3px",
          }}
        />
      </DialogTitle>
      <DialogContent sx={{ pb: 0 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {userLanguage === "en" ? currentMenu.title_en : currentMenu.title}
        </Typography>
        {currentMenu.MenuSize && (!menus || menus.length === 1) && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {userLanguage === "en"
              ? currentMenu.MenuSize.title_en
              : currentMenu.MenuSize.title}
          </Typography>
        )}
        {currentMenu.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {userLanguage === "en" ? currentMenu.description_en : currentMenu.description}
          </Typography>
        )}
        {currentMenu.Allergy && currentMenu.Allergy.length > 0 && (
          <Typography
            variant="body1"
            color="secondary"
            sx={{ display: "flex", alignItems: "center", mt: 1 }}
          >
            <BugReportIcon sx={{ mr: 1 }} />
            {currentMenu.Allergy.sort(allergySort)
              .map((allergy) =>
                userLanguage === "en" ? allergy.description_en : allergy.description
              )
              .join(", ")}
          </Typography>
        )}
        {menus && menus.length > 1 && (
          <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
            <FormLabel component="legend">
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                {checkDictionnary("_TAILLE")}
              </Typography>
            </FormLabel>
            <RadioGroup
              aria-label="Size"
              name="size"
              value={currentMenuId.toString()}
              onChange={handleChangeSize}
            >
              {menus.map((m) => (
                <FormControlLabel
                  key={m.id}
                  value={m.id.toString()}
                  control={<Radio color="primary" sx={{ py: 0.5 }} />}
                  label={
                    userLanguage === "en"
                      ? m.MenuSize.title_en
                      : m.MenuSize.title
                  }
                />
              ))}
            </RadioGroup>
          </FormControl>
        )}
        {currentMenu.Extra && currentMenu.Extra.length > 0 && (
          <FormControl component="fieldset" sx={{ mt: 2, width: "100%" }}>
            <FormLabel component="legend">
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                {checkDictionnary("_SUPPLEMENTS")}
              </Typography>
            </FormLabel>
            <FormGroup>
              {currentMenu.Extra.sort(extraSort).map((extra) => (
                <FormControlLabel
                  key={extra.id}
                  control={
                    <Checkbox
                      color="primary"
                      value={extra.id.toString()}
                      checked={extras.some((x) => x.id === extra.id)}
                      onChange={(e, checked) => handleChangeExtra(e, checked)}
                      sx={{ py: 0.5 }}
                    />
                  }
                  label={
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography variant="body1" noWrap>
                          {userLanguage === "en" ? extra.title_en : extra.title}
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography variant="body1">
                          {`(+ ${parseFloat(extra.pricing).toLocaleString("fr", {
                            minimumFractionDigits: 2,
                          })} €)`}
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                />
              ))}
            </FormGroup>
          </FormControl>
        )}
        <Grid container alignItems="center" sx={{ mt: 2 }}>
          <Grid item xs sx={{ textAlign: "right" }}>
            <IconButton color="primary" onClick={handleRemoveQuantity}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Grid>
          <Grid item xs sx={{ textAlign: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {quantity}
            </Typography>
          </Grid>
          <Grid item xs sx={{ textAlign: "left" }}>
            <IconButton color="primary" onClick={handleAddQuantity}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body1" color="text.secondary">
            {checkDictionnary("_PRIX")} :{" "}
            {totalPricing.toLocaleString("fr", {
              minimumFractionDigits: 2,
            })}{" "}
            €
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          boxShadow: "0px -3px 6px -2px rgba(0,0,0,0.07)",
          p: 2,
          display: { xs: "block", md: "flex" },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            onAdd({
              menu: currentMenu,
              quantity,
              remark: "",
              extras,
            })
          }
          fullWidth
          sx={{ mb: { xs: 2, md: 0 } }}
        >
          {checkDictionnary("_AJOUTER_AU_PANIER")}
        </Button>
        <Button variant="outlined" color="primary" onClick={onClose} fullWidth>
          {checkDictionnary("_ANNULER")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
