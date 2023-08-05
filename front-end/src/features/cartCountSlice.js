import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartCount: 0,
};

export const cartCountSlice = createSlice({
  name: "cart_count",
  initialState,
  reducers: {
    setCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    unSetCartCount: (state, action) => {
      state.cartCount = action.payload;
    },
    incrementCartCount: (state) => {
      state.cartCount = state.cartCount + 1;
    },
    decrementCartCount: (state) => {
      state.cartCount = state.cartCount - 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCartCount, unSetCartCount, incrementCartCount, decrementCartCount } =
  cartCountSlice.actions;

export default cartCountSlice.reducer;
