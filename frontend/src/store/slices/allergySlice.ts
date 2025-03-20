// ./slices/allergySlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IAllergy from "../../interfaces/IAllergy";

interface AllergyState {
  allergyList: IAllergy[];
}

const initialState: AllergyState = {
  allergyList: []
};

const allergySlice = createSlice({
  name: "allergy",
  initialState,
  reducers: {
    // Remplace l'action classique "SET_ALLERGY_LIST"
    setAllergyList(state, action: PayloadAction<IAllergy[]>) {
      state.allergyList = action.payload;
    }
  }
});

export const { setAllergyList } = allergySlice.actions;
export default allergySlice.reducer;
