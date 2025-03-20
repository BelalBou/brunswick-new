// ./slices/settingSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import ISetting from "../../interfaces/ISetting";

interface SettingState {
  settingList: ISetting[];
}

const initialState: SettingState = {
  settingList: []
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
