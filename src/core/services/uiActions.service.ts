import { ApplicationConfig } from "@/config/application.config";
import { AppManagerServices } from "./appManager.service";
import { uiRegistry } from "./uiRegistery.service";

const _AppManager = AppManagerServices;

export class UiActions {
    private rootContainer: HTMLElement | null = null;

    openApp(appId: string, icon?: HTMLDivElement) {
        const app = AppManagerServices.getApp(appId);
        if (!app) {
            console.error(`❌ App "${appId}" not found`);
            return;
        }

        if (AppManagerServices.openApps.has(appId)) {
            this.bringToFront(appId);
            return;
        }

        app.isOpen = true;
        app.isMinimized = false;
        app.style.zIndex = this.getNextZIndex();

        AppManagerServices.openApps.add(appId);

        if (icon) this.expandIcon(icon);

        this.notifyListeners("appOpened", { appId });
    }

    closeApp(appId: string) {
        const app = AppManagerServices.getApp(appId);
        if (!app || !_AppManager.openApps.has(appId)) return;

        app.isOpen = false;
        app.isMinimized = false;
        app.style.zIndex = 0;

        _AppManager.openApps.delete(appId);
        _AppManager.minimizedApps.delete(appId);

        console.log(`❌ Closed: ${app.name}`);
        this.notifyListeners("appClosed", { appId });
    }

    minimizeApp(appId: string) {
        const windowEl = uiRegistry.getWindow(appId);
        const iconEl = uiRegistry.getIcon(appId);

        if (!windowEl || !iconEl) return;

        this.prepareForShrink(windowEl);

        this.shrinkToIcon(windowEl, iconEl);
    }

    minimizeAllApp() {
        const apps = _AppManager.getAllApps();
        apps.forEach((app) => this.minimizeApp(app.id));
    }

    restoreApp(appId: string) {
        const app = AppManagerServices.getApp(appId);
        if (!app || !_AppManager.minimizedApps.has(appId)) return;

        app.isMinimized = false;
        _AppManager.minimizedApps.delete(appId);
        this.bringToFront(appId);

        console.log(`🔄 Restored: ${app.name}`);
        this.notifyListeners("appRestored", { appId });
    }

    bringToFront(appId: string) {
        const app = AppManagerServices.getApp(appId);
        if (app) {
            app.style.zIndex = this.getNextZIndex();
            this.notifyListeners("appFocused", { appId });
        }
    }

    private getNextZIndex(): number {
        let maxZ = 0;
        _AppManager.apps.forEach((app) => {
            if (app.isOpen && !app.isMinimized) {
                maxZ = Math.max(maxZ, app.style.zIndex);
            }
        });
        return maxZ + 1;
    }

    isAppOpen(appId: string): boolean {
        return _AppManager.openApps.has(appId);
    }

    isAppMinimized(appId: string): boolean {
        return _AppManager.minimizedApps.has(appId);
    }

    private notifyListeners(event: string, data: any) {
        _AppManager.listeners.forEach((listener) => {
            try {
                listener(event, data);
            } catch (error) {
                console.error(`Error in listener for ${event}:`, error);
            }
        });
    }

    debug() {
        console.log("=== CoreService Debug ===");
        console.log("All apps:", Array.from(_AppManager.apps.keys()));
        console.log("Open apps:", Array.from(_AppManager.openApps));
        console.log("Minimized apps:", Array.from(_AppManager.minimizedApps));
        console.log("Total apps:", _AppManager.apps.size);
        console.log("========================");
    }

    expandIcon(element: HTMLDivElement) {
        const container = this.rootContainer;
        if (!container) {
            console.error("❌ No root container found");
            return;
        }
        const elementSvg = element.getElementsByTagName("svg");

        const iconRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const clone = element.cloneNode(true) as HTMLDivElement;
        const clonedSvg = elementSvg[0].cloneNode(true) as SVGElement;
        clonedSvg.style.transform = "scale(1 / scaleX, 1 / scaleY)";

        const existingSvg = clone.querySelector("svg");
        if (existingSvg) {
            existingSvg.remove();
        }

        clone.appendChild(clonedSvg);

        document.body.appendChild(clone);

        // Start from icon position
        clone.style.position = "fixed";
        clone.style.left = `${iconRect.left}px`;
        clone.style.top = `${iconRect.top}px`;
        clone.style.width = `${iconRect.width}px`;
        clone.style.height = `${iconRect.height}px`;
        clone.style.margin = "0";
        clone.style.zIndex = "9999";
        clone.style.transformOrigin = "top left";
        clone.style.borderRadius = "20px";

        // Force layout
        clone.getBoundingClientRect();

        const scaleX = containerRect.width / iconRect.width;
        const scaleY = containerRect.height / iconRect.height;

        const inverseScaleX = 1 / scaleX;
        const inverseScaleY = 1 / scaleY;

        clonedSvg.style.transformOrigin = "center";
        clonedSvg.style.transform = `scale(${inverseScaleX}, ${inverseScaleY})`;

        const translateX = containerRect.left - iconRect.left;
        const translateY = containerRect.top - iconRect.top;

        clone.style.transition = `
            transform 400ms cubic-bezier(0.32, 0.72, 0, 1),
            border-radius 400ms cubic-bezier(0.32, 0.72, 0, 1)
        `;

        clone.style.transform = `
            translate(${translateX}px, ${translateY}px)
            scale(${scaleX}, ${scaleY})
        `;

        clone.style.borderRadius = "1px";

        setTimeout(() => {
            clone.style.opacity = "0";
            setTimeout(() => {
                clone.remove();
            }, 200);
        }, 600);
    }

    private prepareForShrink(element: HTMLElement) {
        const root = this.rootContainer;
        if (!root) return;

        // Capture current visual position BEFORE any layout changes
        const rect = element.getBoundingClientRect();

        // Force element into fixed coordinate system (same as animation layer)
        element.style.position = "fixed";

        // Lock it exactly where it visually is
        element.style.left = `${rect.left}px`;
        element.style.top = `${rect.top}px`;
        element.style.width = `${rect.width}px`;
        element.style.height = `${rect.height}px`;

        // Reset transform baseline (important for predictable animation math)
        element.style.transform = "translate(0px, 0px) scale(1)";
        element.style.transformOrigin = "center center";

        // Ensure smooth GPU animation
        element.style.willChange = "transform, opacity";

        // Force reflow so browser commits state before animation starts
        element.getBoundingClientRect();
    }

    shrinkToIcon(element: HTMLElement, targetIcon: HTMLElement) {
        const iconRect = targetIcon.getBoundingClientRect();
        const windowRect = element.getBoundingClientRect();

        // Center-based delta (prevents offset drift)
        const translateX =
            iconRect.left +
            iconRect.width / 2 -
            (windowRect.left + windowRect.width / 2);

        const translateY =
            iconRect.top +
            iconRect.height / 2 -
            (windowRect.top + windowRect.height / 2);

        // Scale based on icon size vs window size
        const scaleX = iconRect.width / windowRect.width;
        const scaleY = iconRect.height / windowRect.height;

        // Smooth OS-like easing
        element.style.transition = `
        transform 400ms cubic-bezier(0.32, 0.72, 0, 1),
        border-radius 400ms cubic-bezier(0.32, 0.72, 0, 1),
        opacity 250ms linear
    `;

        // Ensure correct clipping during transform (critical for visual correctness)
        element.style.overflow = "hidden";

        // Apply OS-style shrink animation
        element.style.transform = `
        translate(${translateX}px, ${translateY}px)
        scale(${scaleX}, ${scaleY})
    `;

        // Match dock rounding feel
        element.style.borderRadius = `${ApplicationConfig.appRadius}px`;

        // 🔥 fade OUT BEFORE reaching final frame (prevents “snap at icon”)
        setTimeout(() => {
            element.style.opacity = "0";
        }, 250);

        // safe cleanup AFTER animation completes
        setTimeout(() => {
            element.remove();
        }, 420);
    }
    restoreElement(element: HTMLElement): void {
        if (!element) return;

        element.style.width = element.dataset.originalWidth || "";
        element.style.height = element.dataset.originalHeight || "";
        element.style.position = element.dataset.originalPosition || "";

        setTimeout(() => {
            element.style.transition = "";
        }, 300);

        console.log(`🔄 Restored element:`, element);
    }

    setRootContainer(el: HTMLElement) {
        this.rootContainer = el;
    }
}

export const uiActionsService = new UiActions();
