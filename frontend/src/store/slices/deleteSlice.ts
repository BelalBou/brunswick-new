import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DeleteState {
  isDeletePending: boolean;
  isDeleteSuccess: boolean;
  deleteError: string;
}

const initialState: DeleteState = {
  isDeletePending: false,
  isDeleteSuccess: false,
  deleteError: ""
};

const deleteSlice = createSlice({
  name: "delete",
  initialState,
  reducers: {
    setDeletePending(state, action: PayloadAction<boolean>) {
      state.isDeletePending = action.payload;
    },
    setDeleteSuccess(state, action: PayloadAction<boolean>) {
      state.isDeleteSuccess = action.payload;
    },
    setDeleteError(state, action: PayloadAction<string>) {
      state.deleteError = action.payload;
    }
  }
});

export const { setDeletePending, setDeleteSuccess, setDeleteError } = deleteSlice.actions;
export default deleteSlice.reducer;
