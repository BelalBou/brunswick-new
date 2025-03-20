// ./slices/extraSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IExtra from "../../interfaces/IExtra";

interface ExtraState {
  extraList: IExtra[];
}

const initialState: ExtraState = {
  extraList: []
};

const extraSlice = createSlice({
  name: "extra",
  initialState,
  reducers: {
    // Équivalent de "SET_EXTRA_LIST"
    setExtraList(state, action: PayloadAction<IExtra[]>) {
      state.extraList = action.payload;
    }
  }
});

export const { setExtraList } = extraSlice.actions;
export default extraSlice.reducer;
