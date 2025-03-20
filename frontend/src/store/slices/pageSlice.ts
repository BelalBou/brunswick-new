// ./slices/pageSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PageState {
  selected: number;
}

const initialState: PageState = {
  selected: 1
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setSelected(state, action: PayloadAction<number>) {
      state.selected = action.payload;
    }
  }
});

export const { setSelected } = pageSlice.actions;
export default pageSlice.reducer;
