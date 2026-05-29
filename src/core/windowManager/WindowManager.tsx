"use client";

import { useState, useEffect } from "react";
import { useAppManager } from "@/shared/hooks/useAppManager";
import { uiActionsService } from "@/core/services/uiActions.service";
import { uiRegistry } from "../services/uiRegistery.service";
import { ApplicationConfig } from "@/config/application.config";

const WindowManager = () => {
    const { openApps } = useAppManager();
    const [renderableApps, setRenderableApps] = useState<typeof openApps>([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRenderableApps(openApps);
        }, 400);

        return () => clearTimeout(timer);
    }, [openApps]);

    return (
        <>
            {renderableApps.map((app) => {
                const Component = app.Component;

                return (
                    <div
                        key={app.id}
                        ref={(el) => {
                            if (el) {
                                uiRegistry.registerWindow(app.id, el);
                            } else {
                                uiRegistry.unregisterWindow(app.id);
                            }
                        }}
                        style={{
                            position: "absolute",
                            inset: 0,
                            zIndex: app.style.zIndex,
                            display: app.isMinimized ? "none" : "block",
                            background: app.style.bgColor,
                            borderRadius: `${ApplicationConfig.appRadius}px`,
                            overflow: "hidden",
                        }}
                        onMouseDown={() =>
                            uiActionsService.bringToFront(app.id)
                        }
                    >
                        <Component />
                    </div>
                );
            })}
        </>
    );
};

export default WindowManager;
