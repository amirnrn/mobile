import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./../sharedSlices/app.slice";

export const store = configureStore({
    reducer: {
        app: appReducer,
    },
    // No persistence middleware included
});
export type RootState = ReturnType<typeof store.getState>;
