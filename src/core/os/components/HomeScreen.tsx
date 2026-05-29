"use client";

import Dock from "./Dock";
import ApplicationIcon from "@/shared/ui/ApplicationIcon";
import { uiActionsService } from "@/core/services/uiActions.service";
import { useAppManager } from "@/shared/hooks/useAppManager";
import { useDispatch } from "react-redux";
import { setOpenedAppId } from "@/shared/redux/sharedSlices/app.slice";

const HomeScreen = () => {
    const { apps } = useAppManager();
    const dispatch = useDispatch();

    const handleOpenApp = (appId: string, icon: HTMLDivElement) => {
        uiActionsService.openApp(appId, icon);
        dispatch(setOpenedAppId(appId));
    };

    return (
        <div className="h-full relative flex flex-col justify-between items-center">
            <div className="grid grid-cols-4 grid-rows-6 gap-4 p-5">
                {apps.map((app) => (
                    <ApplicationIcon
                        key={app.id}
                        id={app.id}
                        applicationBgColor={app.style.bgColor}
                        applicationIcon={app.Icon}
                        applicationName={app.name}
                        onClick={handleOpenApp}
                    />
                ))}
            </div>
            <Dock />
        </div>
    );
};

export default HomeScreen;
