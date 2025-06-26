import { configureStore } from "@reduxjs/toolkit";
import { apiCategory } from "../services/apiCategory";
import { authApi } from "../services/authApi";
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
});

export type RootState = ReturnType<typeof store.getState>;
export type AddDispatch = typeof store.dispatch;

export const UseAppDisptacth: () => AddDispatch = useDispatch;
export const UseAppSelector: TypedUseSelectorHook<RootState> = useSelector;