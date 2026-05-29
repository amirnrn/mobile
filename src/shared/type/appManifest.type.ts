import { ComponentType } from "react";
import { LucideIcon } from "lucide-react";

export interface IAppManifest {
    id: string;
    name: string;
    Icon: LucideIcon;
    Component: ComponentType;
    isOpen: boolean;
    isMinimized: boolean;
    style: {
        zIndex: number;
        bgColor: string;
    };
}
