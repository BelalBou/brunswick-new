// ./slices/loginSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  isLoginPending: boolean;
  isLoginSuccess: boolean;
  loginError: string;
}

const initialState: LoginState = {
  isLoginPending: false,
  isLoginSuccess: false,
  loginError: ""
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginPending(state, action: PayloadAction<boolean>) {
      state.isLoginPending = action.payload;
    },
    setLoginSuccess(state, action: PayloadAction<boolean>) {
      state.isLoginSuccess = action.payload;
    },
    setLoginError(state, action: PayloadAction<string>) {
      state.loginError = action.payload;
    }
  }
});

export const { setLoginPending, setLoginSuccess, setLoginError } = loginSlice.actions;
export default loginSlice.reducer;
