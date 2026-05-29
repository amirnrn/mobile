import { useEffect, useState } from "react";
import { AppManagerServices } from "@/core/services/appManager.service";

export const useAppManager = () => {
    const [apps, setApps] = useState(() => AppManagerServices.getAllApps());
    const [openApps, setOpenApps] = useState(() =>
        AppManagerServices.getOpenApps(),
    );

    useEffect(() => {
        const unsubscribe = AppManagerServices.subscribe(() => {
            setApps(AppManagerServices.getAllApps());
            setOpenApps(AppManagerServices.getOpenApps());
        });

        return () => unsubscribe();
    }, []);

    return {
        apps,
        openApps,
    };
};
