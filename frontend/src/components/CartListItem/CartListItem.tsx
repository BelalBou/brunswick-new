import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Typography,
  Divider,
  styled
} from "@mui/material";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";

interface CartListItemProps {
  cart: ICart;
  userLanguage: string;
  onOpenEdit: (cart: ICart) => void;
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.action.hover
  }
}));

const StyledListItemSecondaryAction = styled(ListItemSecondaryAction)(({ theme }) => ({
  marginRight: theme.spacing(2)
}));

function calculateTotalExtras(extras: IExtra[]): number {
  if (!extras || extras.length === 0) return 0;
  return extras.reduce((total, extra) => total + parseFloat(extra.pricing), 0);
}

const CartListItem: React.FC<CartListItemProps> = ({ cart, userLanguage, onOpenEdit }) => {
  const totalPricing =
    cart.quantity * parseFloat(cart.menu.pricing) +
    cart.quantity * calculateTotalExtras(cart.extras);

  return (
    <>
      <StyledListItem onClick={() => onOpenEdit(cart)}>
        <ListItemAvatar>
          <Typography variant="subtitle2" gutterBottom color="primary">
            {cart.quantity}x
          </Typography>
        </ListItemAvatar>
        <ListItemText
          primary={userLanguage === "en" ? cart.menu.title_en : cart.menu.title}
          secondary={
            <>
              {cart.menu.MenuSize
                ? userLanguage === "en"
                  ? cart.menu.MenuSize.title_en
                  : cart.menu.MenuSize.title
                : "/"}
              {cart.remark && (
                <>
                  <br />
                  {cart.remark}
                </>
              )}
            </>
          }
        />
        <StyledListItemSecondaryAction>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {totalPricing.toLocaleString("fr", {
              minimumFractionDigits: 2
            })}{" "}
            €
          </Typography>
        </StyledListItemSecondaryAction>
      </StyledListItem>
      <Divider />
    </>
  );
};

export default CartListItem;
