import { AppManagerServices } from "@/core/services/appManager.service";
import { manifests } from "./generated-manifests";

export const registerManifests = async () => {
    await Promise.all(
        manifests.map(async (manifest) => {
            const importedModule = await import(
                `./applications/${manifest}/manifest/manifest.ts`
            );
            AppManagerServices.registerApp(importedModule.manifest);
        }),
    );
};
