import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  styled
} from "@mui/material";
import CartTableItem from "../CartTableItem/CartTableItem";
import CartEmpty from "../CartEmpty/CartEmpty";
import ICart from "../../interfaces/ICart";
import IExtra from "../../interfaces/IExtra";

interface CartTableProps {
  cartList: ICart[];
  readOnly: boolean;
  userType: string;
  userLanguage: string;
  onEditShoppingCart: (
    cart: ICart,
    quantity: number,
    remark: string,
    extras: IExtra[]
  ) => void;
  onDeleteShoppingCart: (cart: ICart) => void;
  checkDictionnary: (tag: string) => string;
}

const StyledTable = styled(Table)(({ theme }) => ({
  marginTop: theme.spacing(2),
  '& .MuiTableCell-root': {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`
  }
}));

const CartTable: React.FC<CartTableProps> = ({
  cartList,
  readOnly,
  userType,
  userLanguage,
  onEditShoppingCart,
  onDeleteShoppingCart,
  checkDictionnary
}) => (
  <>
    {cartList && cartList.length > 0 && (
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>Menu</TableCell>
            <TableCell>{checkDictionnary("_TAILLE")}</TableCell>
            {userType !== "supplier" && (
              <TableCell align="right">{checkDictionnary("_PRIX")}</TableCell>
            )}
            <TableCell>{checkDictionnary("_QUANTITE")}</TableCell>
            {userType !== "supplier" && <TableCell>Action</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {cartList.map(cart => (
            <CartTableItem
              key={cart.menu.id}
              item={cart}
              readOnly={readOnly}
              userType={userType}
              userLanguage={userLanguage}
              onEditShoppingCart={onEditShoppingCart}
              onDeleteShoppingCart={onDeleteShoppingCart}
              checkDictionnary={checkDictionnary}
            />
          ))}
        </TableBody>
      </StyledTable>
    )}
    {(!cartList || cartList.length === 0) && (
      <CartEmpty checkDictionnary={checkDictionnary} />
    )}
  </>
);

export default CartTable;
