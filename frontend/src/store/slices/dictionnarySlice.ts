// ./slices/dictionnarySlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IDictionnary from "../../interfaces/IDictionnary";

interface DictionnaryState {
  dictionnaryList: IDictionnary[];
}

const initialState: DictionnaryState = {
  dictionnaryList: []
};

const dictionnarySlice = createSlice({
  name: "dictionnary",
  initialState,
  reducers: {
    // Remplace "SET_DICTIONNARY_LIST"
    setDictionnaryList(state, action: PayloadAction<IDictionnary[]>) {
      state.dictionnaryList = action.payload;
    }
  }
});

export const { setDictionnaryList } = dictionnarySlice.actions;
export default dictionnarySlice.reducer;
