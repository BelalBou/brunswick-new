import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICart from "../../interfaces/ICart";

// Définition de l'interface pour l'état "cart"
interface CartState {
  cartList: ICart[];
}

const initialState: CartState = {
  cartList: []
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Remplace l'ancienne action "SET_CART_LIST"
    setCartList(state, action: PayloadAction<ICart[]>) {
      state.cartList = action.payload;
    }
  }
});

export const { setCartList } = cartSlice.actions;
export default cartSlice.reducer;
