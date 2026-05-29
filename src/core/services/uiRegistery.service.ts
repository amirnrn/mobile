type AppUIBinding = {
    window?: HTMLElement;
    icon?: HTMLElement;
};

class UiRegistry {
    private bindings = new Map<string, AppUIBinding>();

    registerWindow(appId: string, el: HTMLElement) {
        const current = this.bindings.get(appId) || {};
        current.window = el;
        this.bindings.set(appId, current);
    }

    registerIcon(appId: string, el: HTMLElement) {
        const current = this.bindings.get(appId) || {};
        current.icon = el;
        this.bindings.set(appId, current);
    }

    getWindow(appId: string) {
        return this.bindings.get(appId)?.window;
    }

    getIcon(appId: string) {
        return this.bindings.get(appId)?.icon;
    }

    unregisterWindow(appId: string) {
        const current = this.bindings.get(appId);
        if (!current) return;

        delete current.window;
    }

    unregisterIcon(appId: string) {
        const current = this.bindings.get(appId);
        if (!current) return;

        delete current.icon;
    }
}

export const uiRegistry = new UiRegistry();
