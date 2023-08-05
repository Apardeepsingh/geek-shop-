import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  name: "",
  mobile: "",
  address: "",
  isAdmin: "",
};

export const userSlice = createSlice({
  name: "user_info",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.mobile = action.payload.mobile;
      state.address = action.payload.address;
      state.isAdmin = action.payload.isAdmin;
    },
    unSetUserInfo: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.mobile = action.payload.mobile;
      state.address = action.payload.address;
      state.isAdmin = action.payload.isAdmin;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUserInfo, unSetUserInfo } = userSlice.actions;

export default userSlice.reducer;
