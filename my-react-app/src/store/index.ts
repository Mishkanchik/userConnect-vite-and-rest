import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { authApi } from "../services/authApi";
import { apiProduct } from "../services/apiProduct";
import authReducer from "../slices/authSlice";
import cartReducer from "../slices/cartSlice";
import {
  useDispatch,
  type TypedUseSelectorHook,
  useSelector,
} from "react-redux";

export const store = configureStore({
  reducer: {
    [apiCategory.reducerPath]: apiCategory.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [apiProduct.reducerPath]: apiProduct.reducer,
    auth: authReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiCategory.middleware,
      authApi.middleware,
      apiProduct.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// хука для диспатчу та селектора
export const UseAppDispatch: () => AppDispatch = useDispatch;
export const UseAppSelector: TypedUseSelectorHook<RootState> = useSelector;
