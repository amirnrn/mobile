import { Calculator as CalculatorIcon } from "lucide-react";
import Calculator from "../page";
import { IAppManifest } from "@/shared/type/appManifest.type";

export const manifest: IAppManifest = {
    id: "2",
    Icon: CalculatorIcon,
    name: "Calculator",
    Component: Calculator,
    isMinimized: false,
    isOpen: false,
    style: {
        zIndex: 0,
        bgColor: "#323232",
    },
};
