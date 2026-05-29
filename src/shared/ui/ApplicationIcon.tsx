"use client";
import { useRef, useEffect } from "react";
import { uiRegistry } from "@/core/services/uiRegistery.service";
import { ApplicationConfig } from "@/config/application.config";
import { LucideIcon } from "lucide-react";

const ApplicationIcon = ({
    id,
    applicationIcon: IconComponent,
    applicationBgColor,
    applicationName,
    onClick,
}: {
    id: string;
    applicationIcon: LucideIcon;
    applicationName?: string;
    applicationBgColor: string;
    onClick?: (appId: string, icon: HTMLDivElement) => void;
}) => {
    const { appIconSize, appRadius } = ApplicationConfig;
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (iconRef.current) {
            uiRegistry.registerIcon(id, iconRef.current);
        }

        return () => {
            uiRegistry.unregisterIcon(id);
        };
    }, [id]);

    const handleIconClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const targetElement = e.target as HTMLElement;
        const iconDiv = targetElement.closest(
            ".aspect-square",
        ) as HTMLDivElement;

        if (onClick && iconDiv) {
            onClick(id, iconDiv);
        }
    };

    return (
        <div
            className=" h-fit flex flex-col items-center gap-1"
            onClick={handleIconClick}
        >
            <div
                ref={iconRef}
                style={{
                    width: `${appIconSize}px`,
                    borderRadius: `${appRadius}px`,
                    backgroundColor: applicationBgColor,
                }}
                className="aspect-square flex justify-center items-center"
            >
                <IconComponent size={24} color="white" />
            </div>
            {applicationName && (
                <p className="w-full text-center text-sm">{applicationName}</p>
            )}
        </div>
    );
};

export default ApplicationIcon;
