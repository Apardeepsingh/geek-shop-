import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stateCount: 0,
};

export const changeStateToGetProductsSlice = createSlice({
  name: "state_refetch_products",
  initialState,
  reducers: {
    incrementStateCount: (state) => {
      state.stateCount = state.stateCount + 1;
    },
    decrementStateCount: (state) => {
      state.stateCount = state.stateCount - 1;
    },
  },
});

// Action creators are generated for each case reducer function
export const {  incrementStateCount, decrementStateCount } =
  changeStateToGetProductsSlice.actions;

export default changeStateToGetProductsSlice.reducer;
