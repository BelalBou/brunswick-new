import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EditState {
  isEditPending: boolean;
  isEditSuccess: boolean;
  editError: string;
}

const initialState: EditState = {
  isEditPending: false,
  isEditSuccess: false,
  editError: ""
};

const editSlice = createSlice({
  name: "edit",
  initialState,
  reducers: {
    setEditPending(state, action: PayloadAction<boolean>) {
      state.isEditPending = action.payload;
    },
    setEditSuccess(state, action: PayloadAction<boolean>) {
      state.isEditSuccess = action.payload;
    },
    setEditError(state, action: PayloadAction<string>) {
      state.editError = action.payload;
    }
  }
});

export const { setEditPending, setEditSuccess, setEditError } = editSlice.actions;
export default editSlice.reducer;
