import React from "react";
import { List, styled } from "@mui/material";
import CartListItem from "../CartListItem/CartListItem";
import CartEmpty from "../CartEmpty/CartEmpty";
import ICart from "../../interfaces/ICart";

interface CartListProps {
  cartList: ICart[];
  userLanguage: string;
  onOpenEdit: (cart: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const StyledList = styled(List)({
  width: "100%"
});

const CartList: React.FC<CartListProps> = ({
  userLanguage,
  cartList,
  onOpenEdit,
  checkDictionnary
}) => {
  return (
    <>
      {cartList && cartList.length > 0 && (
        <StyledList>
          {cartList.map(cart => (
            <CartListItem
              key={cart.menu.id}
              cart={cart}
              userLanguage={userLanguage}
              onOpenEdit={onOpenEdit}
            />
          ))}
        </StyledList>
      )}
      {(!cartList || cartList.length === 0) && (
        <CartEmpty checkDictionnary={checkDictionnary} />
      )}
    </>
  );
};

export default CartList;
