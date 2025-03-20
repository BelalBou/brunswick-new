// ./slices/menuSizeSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IMenuSize from "../../interfaces/IMenuSize";

interface MenuSizeState {
  menuSizeList: IMenuSize[];
}

const initialState: MenuSizeState = {
  menuSizeList: []
};

const menuSizeSlice = createSlice({
  name: "menuSize",
  initialState,
  reducers: {
    // Remplace l'ancienne action "SET_MENU_SIZE_LIST"
    setMenuSizeList(state, action: PayloadAction<IMenuSize[]>) {
      state.menuSizeList = action.payload;
    }
  }
});

export const { setMenuSizeList } = menuSizeSlice.actions;
export default menuSizeSlice.reducer;
