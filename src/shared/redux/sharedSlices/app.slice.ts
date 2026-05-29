import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IinitialState {
    openedAppId: null | string;
    openedAppIcon: any | null;
}

const initialState: IinitialState = {
    openedAppId: null,
    openedAppIcon: null,
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setOpenedAppId: (state, action: PayloadAction<string>) => {
            state.openedAppId = action.payload;
        },
        setOpenedAppIcon: (state, action: PayloadAction<any>) => {
            state.openedAppIcon = action.payload;
        },
        resetOpnedApp: (state) => {
            state.openedAppId = null;
            state.openedAppIcon = null;
        },
    },
});

export const { setOpenedAppId, resetOpnedApp, setOpenedAppIcon } =
    appSlice.actions;
export default appSlice.reducer;
