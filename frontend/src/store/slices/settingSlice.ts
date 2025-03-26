// ./slices/settingSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ISetting from "../../interfaces/ISetting";

interface SettingState {
  settingList: ISetting[];
  is_away: boolean;
  serverTime: string;
}

const initialState: SettingState = {
  settingList: [],
  is_away: false,
  serverTime: ""
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    // Remplace l'ancienne action "SET_SETTING_LIST"
    setSettingList(state, action: PayloadAction<ISetting[]>) {
      state.settingList = action.payload;
    }
  }
});

export const { setSettingList } = settingSlice.actions;
export default settingSlice.reducer;
