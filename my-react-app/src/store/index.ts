import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { authApi } from "../services/authApi";
<<<<<<< HEAD
import { apiProduct } from "../services/apiProduct";
import authReducer from "../slices/authSlice";
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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiCategory.middleware,
      authApi.middleware,
      apiProduct.middleware
    ),
=======
import authReducer from "../slices/authSlice";
import {
    useDispatch,
    type TypedUseSelectorHook,
    useSelector,
} from "react-redux";

export const store = configureStore({
    reducer: {
        [apiCategory.reducerPath]: apiCategory.reducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiCategory.middleware, authApi.middleware),
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;

export const UseAppDisptacth: () => AddDispatch = useDispatch;
<<<<<<< HEAD
export const UseAppSelector: TypedUseSelectorHook<RootState> = useSelector;
=======
export const UseAppSelector: TypedUseSelectorHook<RootState> = useSelector;
>>>>>>> 4be268f7ed5c81c790213c1e6a78d8527ab1bc91
