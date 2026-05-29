import { Rethink_Sans } from "next/font/google";
import { IAppManifest } from "../../shared/type/appManifest.type";

export class AppManager {
    public readonly apps = new Map<string, IAppManifest>();
    public readonly openApps = new Set<string>();
    public readonly minimizedApps = new Set<string>();
    public readonly listeners = new Set<(event: string, data: any) => void>();

    registerApp(
        manifest: Omit<IAppManifest, "isOpen" | "isMinimized" | "zIndex">,
    ) {
        if (this.apps.has(manifest.id)) {
            console.warn(`⚠️ App "${manifest.id}" already registered`);
            return;
        }

        this.apps.set(manifest.id, {
            ...manifest,
            isOpen: false,
            isMinimized: false,
            style: {
                ...manifest.style,
                zIndex: 0,
            },
        });

        this.notifyListeners("app:registered", manifest.id);
        console.log(`✅ Registered: ${manifest.name} (${manifest.id})`);
    }

    isAppRegistered(appId: string) {
        const isAppRegistered = this.apps.get(appId);
        if (isAppRegistered) return true;
        else return false;
    }

    getApp(appId: string): IAppManifest | undefined {
        return this.apps.get(appId);
    }

    getAllApps(): IAppManifest[] {
        return Array.from(this.apps.values());
    }

    getOpenApps(): IAppManifest[] {
        return Array.from(this.apps.values()).filter((app) =>
            this.openApps.has(app.id),
        );
    }

    getAppComponent(appId: string): any {
        const app = this.apps.get(appId);
        return app?.Component;
    }

    subscribe(listener: (event: string, data: any) => void) {
        this.listeners.add(listener);

        return () => {
            this.listeners.delete(listener);
        };
    }

    private notifyListeners(event: string, data: any) {
        this.listeners.forEach((listener) => {
            try {
                listener(event, data);
            } catch (error) {
                console.error(`Error in listener for ${event}:`, error);
            }
        });
    }

    debug() {
        console.log("=== AppManager Debug ===");
        console.log("All apps:", Array.from(this.apps.keys()));
        console.log("Open apps:", Array.from(this.openApps));
        console.log("Minimized apps:", Array.from(this.minimizedApps));
        console.log("Total apps:", this.apps.size);
        console.log("========================");
    }
}

export const AppManagerServices = new AppManager();
