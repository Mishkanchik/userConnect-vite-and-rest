import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

type User = {
  username: string;
  email: string;
  phone: string;
  image: string;
  id: string | number;
};

const tokenFromStorage = localStorage.getItem("token");
const userFromStorage = localStorage.getItem("user");

const initialState: {
  user: User | null;
  token: string | null;
} = {
  token: tokenFromStorage,
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { access } = action.payload;
      state.token = access;

      if (access) {
        const decoded = jwtDecode<User>(access);
        state.user = {
          username: decoded.username,
          email: decoded.email,
          phone: decoded.phone,
          image: decoded.image,
          id: decoded.id,
        };

        localStorage.setItem("token", access);
        localStorage.setItem("user", JSON.stringify(state.user));
      } else {
        state.user = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
