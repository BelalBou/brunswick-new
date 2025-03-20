import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AddState = {
  isAddPending: boolean;
  isAddSuccess: boolean;
  addError: string;
};

const initialState: AddState = {
  isAddPending: false,
  isAddSuccess: false,
  addError: ""
};

const addSlice = createSlice({
  name: "add",
  initialState,
  reducers: {
    setAddPending(state, action: PayloadAction<boolean>) {
      state.isAddPending = action.payload;
    },
    setAddSuccess(state, action: PayloadAction<boolean>) {
      state.isAddSuccess = action.payload;
    },
    setAddError(state, action: PayloadAction<string>) {
      state.addError = action.payload;
    }
  }
});

export const { setAddPending, setAddSuccess, setAddError } = addSlice.actions;
export default addSlice.reducer;
