// ./slices/menuSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IMenu from "../../interfaces/IMenu";

interface MenuState {
  menuList: IMenu[];
}

const initialState: MenuState = {
  menuList: []
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    // Remplace l'ancienne action "SET_MENU_LIST"
    setMenuList(state, action: PayloadAction<IMenu[]>) {
      state.menuList = action.payload;
    }
  }
});

export const { setMenuList } = menuSlice.actions;
export default menuSlice.reducer;
