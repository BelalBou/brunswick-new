// ./slices/userSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import IUser from "../../interfaces/IUser";

interface UserState {
  userId: number;
  userFirstName: string;
  userLastName: string;
  userLanguage: string;
  userType: string;
  userSupplierId: number;
  userEmailAddress: string;
  userPassword: string;
  userToken: string;
  userList: IUser[];
  userValidity: string;
}

const initialState: UserState = {
  userId: -1,
  userFirstName: "",
  userLastName: "",
  userLanguage: "fr",
  userType: "",
  userSupplierId: -1,
  userEmailAddress: "",
  userPassword: "",
  userToken: "",
  userList: [],
  userValidity: ""
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId(state, action: PayloadAction<number>) {
      state.userId = action.payload;
    },
    setUserFirstName(state, action: PayloadAction<string>) {
      state.userFirstName = action.payload;
    },
    setUserLastName(state, action: PayloadAction<string>) {
      state.userLastName = action.payload;
    },
    setUserLanguage(state, action: PayloadAction<string>) {
      state.userLanguage = action.payload;
    },
    setUserType(state, action: PayloadAction<string>) {
      state.userType = action.payload;
    },
    setUserSupplierId(state, action: PayloadAction<number>) {
      state.userSupplierId = action.payload;
    },
    setUserEmailAddress(state, action: PayloadAction<string>) {
      state.userEmailAddress = action.payload;
    },
    setUserPassword(state, action: PayloadAction<string>) {
      state.userPassword = action.payload;
    },
    setUserToken(state, action: PayloadAction<string>) {
      state.userToken = action.payload;
    },
    setUserList(state, action: PayloadAction<IUser[]>) {
      state.userList = action.payload;
    },
    setUserValidity(state, action: PayloadAction<string>) {
      state.userValidity = action.payload;
    }
  }
});

export const {
  setUserId,
  setUserFirstName,
  setUserLastName,
  setUserLanguage,
  setUserType,
  setUserSupplierId,
  setUserEmailAddress,
  setUserPassword,
  setUserToken,
  setUserList,
  setUserValidity
} = userSlice.actions;

export default userSlice.reducer;
