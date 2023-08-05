import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { userAuthApi } from "../services/userAuthApi";
import authReducer from "../features/authSlice";
import userReducer from "../features/userSlice";
import cartReducer from "../features/cartSlice";
import cartCountReducer from "../features/cartCountSlice";
import { productsApi } from "../services/productsApi";
import changeStateToGetProductsReducer from "../features/changeStateToGetProductsSlice";


export const store = configureStore({
  reducer: {
    [userAuthApi.reducerPath]: userAuthApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    auth: authReducer,
    user: userReducer,
    cart: cartReducer,
    cartCount: cartCountReducer,
    stateRefetchProducts: changeStateToGetProductsReducer

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAuthApi.middleware, productsApi.middleware),
});

setupListeners(store.dispatch);
