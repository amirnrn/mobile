"use client";
import { AppManagerServices } from "@/core/services/appManager.service";
import { uiActionsService } from "@/core/services/uiActions.service";
import { resetOpnedApp } from "@/shared/redux/sharedSlices/app.slice";
import { RootState } from "@/shared/redux/store/store";
import { useDispatch, useSelector } from "react-redux";

const NavigationBar = () => {
    const { openedAppId } = useSelector((state: RootState) => state.app);
    const dispatch = useDispatch();

    const handleMinimizeApp = () => {
        const openedApps = AppManagerServices.getOpenApps();
        if (openedApps.length == 0) return;

        uiActionsService.minimizeApp(openedAppId);
        uiActionsService.closeApp(openedAppId);
        dispatch(resetOpnedApp());
    };
    return (
        <div
            onClick={handleMinimizeApp}
            className="border-4 border-solid border-gray-400 w-35 m-auto rounded-full absolute bottom-1.25 left-1/2 -translate-x-1/2 z-999"
        ></div>
    );
};

export default NavigationBar;
