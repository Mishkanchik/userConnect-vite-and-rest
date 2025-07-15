import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: number;
}

const initialState: CartItem[] = JSON.parse(
  localStorage.getItem("cart") || "[]"
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      state.push(action.payload);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    removeFromCart(state, action: PayloadAction<number>) {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) state.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart(state) {
      state.length = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
