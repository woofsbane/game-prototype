import { Game } from "./game";
import { AssetManager, GameAsset } from "./assetManager";
import { InputManager } from "./inputManager";
import { Lonk } from "./lonk";
import { MapTile } from "./mapTile";
import { Renderer } from "./renderer";
import "./style.css";

// Entry point: Initialize and start the game when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Get the canvas element
        const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;

        // 2. Initialize AssetManager and load assets
        const assetManager = new AssetManager();
        assetManager.loadImage(GameAsset.BACKGROUND, 'tilesets/background.png');
        assetManager.loadImage(GameAsset.LONK, 'tilesets/lonk.png');
        await assetManager.waitForLoad();

        // 3. Retrieve loaded assets
        const backgroundAsset = assetManager.getAsset(GameAsset.BACKGROUND);
        const lonkAsset = assetManager.getAsset(GameAsset.LONK);

        if (!backgroundAsset || !lonkAsset) {
            throw new Error("Required assets (background or lonk) not loaded after loading process.");
        }

        // 4. Define solid tiles and initial map data
        const solidTiles = [8, 11, 12, 13, 14, 15, 28, 29, 30, 31, 44, 45, 159];
        const initialMapData = [
            [44, 45, 29, 28, 29, 28, 29, 35, 35, 28],
            [28, 29, 35, 7, 8, 9, 0, 2, 35, 12],
            [1, 2, 35, 23, 24, 25, 32, 18, 35, 28],
            [33, 17, 2, 35, 35, 35, 35, 16, 2, 12],
            [35, 16, 18, 35, 35, 35, 0, 17, 34, 28],
            [1, 17, 18, 115, 35, 115, 32, 34, 115, 12],
            [33, 33, 34, 35, 115, 35, 115, 115, 115, 28],
            [13, 12, 13, 12, 13, 115, 115, 115, 115, 12],
        ];

        // 5. Instantiate all other dependencies
        const inputManager = new InputManager();
        const lonk = new Lonk(75, 75); // Initial position for Lonk
        const mapTile = new MapTile(initialMapData, solidTiles, backgroundAsset);
        const renderer = new Renderer(canvas, lonkAsset);

        // 6. Start the game loop
        new Game(
            canvas,
            inputManager,
            lonk,
            mapTile,
            renderer
        ).start();

    } catch (error) {
        console.error("Failed to initialize or start the game:", error);
    }
});