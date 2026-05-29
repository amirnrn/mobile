import { MessageCircle } from "lucide-react";
import Message from "../page";
import { IAppManifest } from "@/shared/type/appManifest.type";

export const manifest: IAppManifest = {
    id: "3",
    Icon: MessageCircle,
    name: "Messages",
    Component: Message,
    isMinimized: false,
    isOpen: false,
    style: {
        zIndex: 0,
        bgColor: "#323232",
    },
};
