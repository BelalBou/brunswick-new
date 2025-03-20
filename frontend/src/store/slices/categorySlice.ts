// ./slices/categorySlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ICategory from "../../interfaces/ICategory";

interface CategoryState {
  categoryList: ICategory[];
}

const initialState: CategoryState = {
  categoryList: []
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategoryList(state, action: PayloadAction<ICategory[]>) {
      state.categoryList = action.payload;
    }
  }
});

export const { setCategoryList } = categorySlice.actions;
export default categorySlice.reducer;
