/**
 * Manages the loading and retrieval of game assets like images.
 */
export class AssetManager {
    private assets: { [key: string]: HTMLImageElement } = {};
    private loadPromises: Promise<void>[] = [];

    /**
     * Loads an image asset.
     * @param name - The name to associate with the loaded image.
     * @param path - The URL path to the image file.
     * @returns The Image object being loaded.
     */
    loadImage(name: string, path: string): HTMLImageElement {
        const img = new Image();
        img.src = path;
        const promise = new Promise<void>((resolve, reject) => {
            img.onload = () => {
                this.assets[name] = img;
                resolve();
            };
            img.onerror = () => {
                console.error(`Failed to load image: ${path}`);
                reject(new Error(`Failed to load image: ${path}`));
            };
        });
        this.loadPromises.push(promise);
        return img;
    }

    /**
     * Retrieves a loaded asset by its name.
     * @param name - The name of the asset to retrieve.
     * @returns The loaded image asset, or undefined if not found.
     */
    getAsset(name: string): HTMLImageElement | undefined {
        return this.assets[name];
    }

    /**
     * Waits for all loaded assets to complete loading.
     * @returns A promise that resolves when all assets are loaded.
     */
    async loadAll(): Promise<void> {
        await Promise.all(this.loadPromises);
        console.log("All assets loaded!");
    }
}