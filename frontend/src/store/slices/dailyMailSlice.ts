// ./slices/dailyMailSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IDailyMail from "../../interfaces/IDailyMail";

interface DailyMailState {
  dailyMailList: IDailyMail[];
}

const initialState: DailyMailState = {
  dailyMailList: []
};

const dailyMailSlice = createSlice({
  name: "dailyMail",
  initialState,
  reducers: {
    // Remplace "SET_DAILY_MAIL_LIST"
    setDailyMailList(state, action: PayloadAction<IDailyMail[]>) {
      state.dailyMailList = action.payload;
    }
  }
});

export const { setDailyMailList } = dailyMailSlice.actions;
export default dailyMailSlice.reducer;
