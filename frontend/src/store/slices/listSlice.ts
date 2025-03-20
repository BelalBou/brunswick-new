import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ListState {
  isListPending: boolean;
  isListSuccess: boolean;
  listError: string;
}

const initialState: ListState = {
  isListPending: false,
  isListSuccess: false,
  listError: ""
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    setListPending(state, action: PayloadAction<boolean>) {
      state.isListPending = action.payload;
    },
    setListSuccess(state, action: PayloadAction<boolean>) {
      state.isListSuccess = action.payload;
    },
    setListError(state, action: PayloadAction<string>) {
      state.listError = action.payload;
    }
  }
});

export const { setListPending, setListSuccess, setListError } = listSlice.actions;
export default listSlice.reducer;
