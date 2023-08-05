import { useGetCartItemsQuery } from "../services/userAuthApi";
import { getToken, removeToken } from "../services/localStorageServices";
import { createAsyncThunk, createSlice, getState } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchCartData = createAsyncThunk(
    "cart_info/fetchCartData",
    async (_, { getState }) => {
      const { access_token } = getToken();
      const { cartData } = getState().cart;
  
      try {
        // Make your API request here to fetch the updated cart data
        const response = await axios.get("http://127.0.0.1:8000/api/user/get-cart-items/", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
  
        return response.data;
      } catch (error) {
        // Handle error if the API request fails
        throw error;
      }
    }
  );


const initialState = {
  cartData: {},
};

export const cartSlice = createSlice({
  name: "cart_info",
  initialState,
  reducers: {
    setCartInfo: (state, action) => {
        state.cartData = action.payload;
    },
    unSetCartInfo: (state, action) => {
        state.cartData = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle the success case of fetchCartData
    builder.addCase(fetchCartData.fulfilled, (state, action) => {
        state.cartData = action.payload;
    });
  },
});

// Action creators are generated for each case reducer function
export const { setCartInfo, unSetCartInfo } = cartSlice.actions;

export default cartSlice.reducer;
