import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import emptyCart from "../../images/empty-cart.svg";

interface CartEmptyProps {
  checkDictionnary: (tag: string) => string;
}

const StyledBox = styled(Box)(({ theme }) => ({
  display: "block",
  width: "100%",
  textAlign: "center"
}));

const StyledImage = styled("img")(({ theme }) => ({
  width: "128px",
  paddingTop: theme.spacing(6)
}));

const CartEmpty: React.FC<CartEmptyProps> = ({ checkDictionnary }) => {
  return (
    <StyledBox>
      <StyledImage src={emptyCart} alt="Panier vide" />
      <Typography
        variant="h5"
        align="center"
        color="text.primary"
        gutterBottom
        sx={{ padding: 4 }}
      >
        {checkDictionnary("_PANIER_VIDE")}
        <Typography
          variant="body2"
          color="text.secondary"
          gutterBottom
          paragraph
          sx={{ paddingTop: 2 }}
        >
          {checkDictionnary("_SI_REMPLIR_PANIER")}
        </Typography>
      </Typography>
    </StyledBox>
  );
};

export default CartEmpty; 