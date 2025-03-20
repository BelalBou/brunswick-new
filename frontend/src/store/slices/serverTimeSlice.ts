// ./slices/serverTimeSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServerTimeState {
  serverTimeList: string;
}

const initialState: ServerTimeState = {
  serverTimeList: ""
};

const serverTimeSlice = createSlice({
  name: "serverTime",
  initialState,
  reducers: {
    // Remplace l'ancienne action "SET_SERVER_TIME_LIST"
    setServerTime(state, action: PayloadAction<string>) {
      state.serverTimeList = action.payload;
    }
  }
});

export const { setServerTime } = serverTimeSlice.actions;
export default serverTimeSlice.reducer;
