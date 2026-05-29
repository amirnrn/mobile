import { Phone as PhoneIcon } from "lucide-react";
import Phone from "../page";
import { IAppManifest } from "@/shared/type/appManifest.type";

export const manifest: IAppManifest = {
    id: "1",
    Icon: PhoneIcon,
    name: "Phone",
    Component: Phone,
    isMinimized: false,
    isOpen: false,
    style: {
        zIndex: 0,
        bgColor: "#323232",
    },
};
