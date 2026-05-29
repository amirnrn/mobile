"use client";
import { ReactNode, useRef, useEffect } from "react";
import StatusBar from "../core/os/components/StatusBar";
import NavigationBar from "../core/os/components/NavigationBar";
import { uiActionsService } from "@/core/services/uiActions.service";
import { ApplicationConfig } from "@/config/application.config";

const AppContainer = ({ children }: { children: ReactNode }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            uiActionsService.setRootContainer(containerRef.current);
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-110 h-210 border-5 border-solid border-[#323232] relative"
            style={{
                borderRadius: `${ApplicationConfig.appRadius + 5}px`,
            }}
        >
            <StatusBar />
            {children}
            <NavigationBar />
        </div>
    );
};

export default AppContainer;
