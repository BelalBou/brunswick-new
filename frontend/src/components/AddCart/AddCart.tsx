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
import CloseIcon from "@mui/icons-material/Close";
import placeHolderIcon from "../../images/placeholder.svg";
import IMenu from "../../interfaces/IMenu";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";
import extraSort from "../../utils/ExtraSort/ExtraSort";
import { allergySort } from "../../utils/AllergySort/AllergySort";
import { S3_BASE_URL } from "../../utils/S3Utils/S3Utils";
import { useTheme } from '@mui/material/styles';

interface AddCartProps {
  menu: IMenu;
  menus: IMenu[];
  userLanguage: string;
  onAdd: (item: ICart) => void;
  onClose: () => void;
  checkDictionnary: (tag: string) => string;
}

export default function AddCart(props: AddCartProps) {
  const theme = useTheme();
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
    if (checked) {
      const extraItem = currentMenu.Extra.find((x) => x.id === extraId);
      if (extraItem) {
        setExtras(prev => [...prev, { ...extraItem }]);
      }
    } else {
      setExtras(prev => prev.filter((x) => x.id !== extraId));
    }
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
          [theme.breakpoints.up('md')]: {
            m: 6,
            maxWidth: "400px",
          },
        },
      }}
    >
      <DialogTitle id="form-dialog-title" sx={{ pb: 1, textAlign: "center" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {checkDictionnary("_AJOUTER_AU_PANIER")}
          </Typography>
          <IconButton onClick={onClose} size="small" edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          component="img"
          src={
            currentMenu.picture
              ? `${S3_BASE_URL}/${currentMenu.picture}`
              : placeHolderIcon
          }
          alt={userLanguage === "en" ? (currentMenu.title_en || currentMenu.title || "") : (currentMenu.title || "")}
          sx={{
            width: { xs: "180px", md: "220px" },
            height: { xs: "180px", md: "220px" },
            objectFit: "cover",
            borderRadius: "8px",
            margin: "0 auto",
            display: "block"
          }}
        />
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          {userLanguage === "en" ? (currentMenu.title_en || currentMenu.title || "") : (currentMenu.title || "")}
        </Typography>
        
        {currentMenu.MenuSize && (!menus || menus.length === 1) && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
            {userLanguage === "en"
              ? (currentMenu.MenuSize.title_en || currentMenu.MenuSize.title || "")
              : (currentMenu.MenuSize.title || "")}
          </Typography>
        )}
        
        {currentMenu.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {userLanguage === "en" ? (currentMenu.description_en || currentMenu.description || "") : (currentMenu.description || "")}
          </Typography>
        )}
        
        <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 600 }}>
          {parseFloat(currentMenu.pricing || "0").toLocaleString("fr", {
            minimumFractionDigits: 2,
          })}{" "}
          €
        </Typography>
        
        {currentMenu.Allergy && currentMenu.Allergy.length > 0 && (
          <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(244, 67, 54, 0.05)', borderRadius: 1 }}>
            <Typography
              variant="body2"
              color="secondary"
              sx={{ display: "flex", alignItems: "center" }}
            >
              <BugReportIcon sx={{ mr: 1, fontSize: 20 }} />
              {currentMenu.Allergy.sort(allergySort)
                .map((allergy) =>
                  userLanguage === "en" ? (allergy.description_en || allergy.description || "") : (allergy.description || "")
                )
                .join(", ")}
            </Typography>
          </Box>
        )}
        {menus && menus.length > 1 && (
          <FormControl component="fieldset" sx={{ mt: 1, mb: 3, width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {checkDictionnary("_TAILLE")}
              </Typography>
            </FormLabel>
            <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1, p: 1 }}>
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body1">
                          {userLanguage === "en"
                            ? (m.MenuSize?.title_en || m.MenuSize?.title || "")
                            : (m.MenuSize?.title || "")}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {parseFloat(m.pricing || "0").toLocaleString("fr", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          €
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', margin: 0 }}
                  />
                ))}
              </RadioGroup>
            </Box>
          </FormControl>
        )}
        {currentMenu.Extra && currentMenu.Extra.length > 0 && (
          <FormControl component="fieldset" sx={{ mb: 3, width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {checkDictionnary("_SUPPLEMENTS")}
              </Typography>
            </FormLabel>
            <Box sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1, p: 1 }}>
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <Typography variant="body1">
                          {userLanguage === "en" ? (extra.title_en || extra.title || "") : (extra.title || "")}
                        </Typography>
                        <Typography variant="body1" color="primary">
                          {`+ ${parseFloat(extra.pricing || "0").toLocaleString("fr", {
                            minimumFractionDigits: 2,
                          })} €`}
                        </Typography>
                      </Box>
                    }
                    sx={{ width: '100%', margin: 0 }}
                  />
                ))}
              </FormGroup>
            </Box>
          </FormControl>
        )}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {checkDictionnary("_QUANTITE")}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(0, 0, 0, 0.12)',
              borderRadius: 1,
              p: 1
            }}
          >
            <IconButton color="primary" onClick={handleRemoveQuantity}>
              <RemoveCircleOutlineIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 600, mx: 4 }}>
              {quantity}
            </Typography>
            <IconButton color="primary" onClick={handleAddQuantity}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            {checkDictionnary("_PRIX_TOTAL")}
          </Typography>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
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
          gap: 2,
          display: { xs: "grid", md: "flex" },
          gridTemplateRows: "1fr 1fr",
          justifyContent: "space-between"
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
          sx={{ height: 48 }}
        >
          {checkDictionnary("_AJOUTER_AU_PANIER")}
        </Button>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={onClose} 
          fullWidth
          sx={{ height: 48 }}
        >
          {checkDictionnary("_ANNULER")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
