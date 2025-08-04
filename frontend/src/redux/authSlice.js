import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const initialState = {
  user: null,
  access: null,
  refresh: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { access, refresh } = action.payload;
      const decoded = jwtDecode(access);
      state.access = action.payload.access;
      state.refresh = action.payload.refresh;
      state.user = decoded;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.access = null;
      state.refresh = null;
      state.isAuthenticated = false;
    },
    refreshToken: (state, action) => {
      const { access } = action.payload;
      const decoded = jwtDecode(access);
      state.access = action.payload.access;;
      state.user = decoded;
    },
  },
});

export const { loginSuccess, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;