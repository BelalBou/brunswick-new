import React, { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  styled
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import BugReportIcon from "@mui/icons-material/BugReport";
import placeHolderIcon from "../../images/placeholder.svg";
import ICart from "../../interfaces/ICart";
import { S3_BASE_URL } from "../../utils/S3Utils/S3Utils";

interface EditCartProps {
  cart: ICart;
  userLanguage: string;
  onEditShoppingCart: (cart: ICart, quantity: number, remark: string) => void;
  onDeleteShoppingCart: (cart: ICart) => void;
  onClose: () => void;
  checkDictionnary: (tag: string) => string;
}

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paperScrollBody": {
    margin: `${theme.spacing(3)} !important`,
    [theme.breakpoints.up("md")]: {
      margin: `${theme.spacing(6)} auto !important`
    }
  }
}));

const StyledImage = styled("img")(({ theme }) => ({
  width: "192px",
  [theme.breakpoints.up("md")]: {
    width: "256px"
  },
  borderRadius: "3px"
}));

const StyledTextField = styled(TextField)({
  marginTop: 0
});

const StyledFormControl = styled(FormControl)({
  width: "100%"
});

const StyledFormControlLabel = styled(FormControlLabel)({
  width: "100%",
  "& .MuiFormControlLabel-label": {
    width: "100%"
  }
});

const EditCart: React.FC<EditCartProps> = ({
  cart,
  userLanguage,
  onEditShoppingCart,
  onDeleteShoppingCart,
  onClose,
  checkDictionnary
}) => {
  const [quantity, setQuantity] = useState(cart.quantity);
  const [remark, setRemark] = useState(cart.remark);

  const handleAddQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const handleRemoveQuantity = () => {
    setQuantity(prev => (prev > 0 ? prev - 1 : prev));
  };

  const handleChangeRemark = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(event.target.value);
  };

  const calculateTotalExtras = () => {
    if (!cart.extras || cart.extras.length === 0) return 0;
    return cart.extras.reduce((total, extra) => total + parseFloat(extra.pricing), 0);
  };

  const totalPricing = quantity * parseFloat(cart.menu.pricing) + quantity * calculateTotalExtras();

  return (
    <StyledDialog
      open
      scroll="body"
      maxWidth="xs"
      onClose={onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title" className="centered-text">
        <StyledImage
          src={cart.menu.picture ? `${S3_BASE_URL}/${cart.menu.picture}` : placeHolderIcon}
          alt={userLanguage === "en" ? cart.menu.title_en : cart.menu.title}
        />
      </DialogTitle>
      <DialogContent>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {userLanguage === "en" ? cart.menu.title_en : cart.menu.title}
        </Typography>
        {cart.menu.MenuSize && (
          <Typography color="text.secondary" variant="body1" sx={{ mt: 1 }}>
            {userLanguage === "en" ? cart.menu.MenuSize.title_en : cart.menu.MenuSize.title}
          </Typography>
        )}
        {cart.menu.description && (
          <Typography color="text.secondary" variant="body1" sx={{ mt: 1 }}>
            {userLanguage === "en" ? cart.menu.description_en : cart.menu.description}
          </Typography>
        )}
        {cart.menu.Allergy && cart.menu.Allergy.length > 0 && (
          <Typography color="secondary" variant="body1" sx={{ mt: 1, display: "flex", alignItems: "center" }}>
            <BugReportIcon sx={{ mr: 1 }} />
            {cart.menu.Allergy.map(allergy =>
              userLanguage === "en" ? allergy.description_en : allergy.description
            ).join(", ")}
          </Typography>
        )}
        {cart.extras && cart.extras.length > 0 && (
          <StyledFormControl sx={{ mt: 4 }}>
            <FormLabel>
              <Typography variant="h6" sx={{ fontWeight: 600 }} gutterBottom>
                {checkDictionnary("_SUPPLEMENTS")}
              </Typography>
            </FormLabel>
            <FormGroup>
              {cart.extras.map(extra => (
                <StyledFormControlLabel
                  key={extra.id}
                  control={
                    <Checkbox
                      color="primary"
                      value={extra.id}
                      checked
                      disabled
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
                            minimumFractionDigits: 2
                          })} €)`}
                        </Typography>
                      </Grid>
                    </Grid>
                  }
                />
              ))}
            </FormGroup>
          </StyledFormControl>
        )}
        <Grid container alignItems="center" sx={{ mt: 1 }}>
          <Grid item xs className="right-text">
            <IconButton color="primary" onClick={handleRemoveQuantity}>
              <RemoveCircleOutlineIcon />
            </IconButton>
          </Grid>
          <Grid item xs className="centered-text">
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {quantity}
            </Typography>
          </Grid>
          <Grid item xs className="left-text">
            <IconButton color="primary" onClick={handleAddQuantity}>
              <AddCircleOutlineIcon />
            </IconButton>
          </Grid>
        </Grid>
        <div className="centered-text">
          <Typography color="text.secondary" variant="body1">
            {checkDictionnary("_PRIX")} :{" "}
            {totalPricing.toLocaleString("fr", {
              minimumFractionDigits: 2
            })}{" "}
            €
          </Typography>
        </div>
        <StyledTextField
          id="standard-multiline-flexible"
          label={checkDictionnary("_REMARQUES")}
          value={remark}
          onChange={handleChangeRemark}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        {quantity > 0 && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => onEditShoppingCart(cart, quantity, remark)}
          >
            {checkDictionnary("_METTRE_A_JOUR")}
          </Button>
        )}
        {quantity === 0 && (
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => onDeleteShoppingCart(cart)}
          >
            {checkDictionnary("_SUPPRIMER_LE_MENU")}
          </Button>
        )}
      </DialogActions>
    </StyledDialog>
  );
};

export default EditCart;
