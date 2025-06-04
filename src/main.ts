import { AssetManager, GameAsset } from "./assetManager";
import { GameConfig } from "./config";
import { FpsDisplay } from "./fpsDisplay";
import { Game } from "./game";
import { InputManager } from "./inputManager";
import { Lonk } from "./lonk";
import { MapScreen } from "./mapScreen";
import { SpriteRenderer } from "./spriteRenderer";
import "./style.css";
import { Viewport, ViewportMode } from "./viewport";
import { WorldMap } from "./worldMap";

document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    canvas.width = 160 * GameConfig.CANVAS_SCALE;
    canvas.height = 144 * GameConfig.CANVAS_SCALE;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error("Could not get 2D rendering context for canvas.");
    }
    ctx.imageSmoothingEnabled = false;

    const assetManager = new AssetManager();
    const backgroundAsset = assetManager.loadImage(GameAsset.BACKGROUND, 'tilesets/background.png');
    const lonkAsset = assetManager.loadImage(GameAsset.LONK, 'tilesets/lonk.png');
    await assetManager.waitForLoad();

    const solidTiles = [
        8, 11, 12, 13, 14, 15,
        28, 29, 30, 31,
        44, 45,
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76,
        80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,
        96, 97, 98, 99, 101, 102, 103, 104, 105, 106, 107, 108,
        159,
    ];
    const map00 = new MapScreen([
        [35, 35, 35, 35, 35, 35, 35, 35, 35, 35],
        [28, 29, 35, 7, 8, 9, 0, 2, 35, 35],
        [1, 2, 35, 23, 24, 25, 32, 18, 35, 35],
        [33, 17, 2, 35, 35, 35, 35, 16, 2, 35],
        [35, 16, 18, 35, 35, 35, 0, 17, 34, 35],
        [1, 17, 18, 115, 35, 115, 32, 34, 115, 35],
        [33, 33, 34, 35, 115, 35, 115, 115, 115, 35],
        [13, 12, 13, 12, 13, 115, 115, 115, 115, 35],
    ], solidTiles);
    const map10 = new MapScreen([
        [44, 45, 29, 28, 29, 28, 29, 35, 35, 28],
        [28, 29, 35, 7, 8, 9, 0, 2, 35, 12],
        [1, 2, 35, 23, 24, 25, 32, 18, 35, 28],
        [33, 17, 2, 35, 35, 35, 35, 16, 2, 12],
        [35, 16, 18, 35, 35, 35, 0, 17, 34, 28],
        [1, 17, 18, 115, 35, 115, 32, 34, 115, 12],
        [33, 33, 34, 35, 115, 35, 115, 115, 115, 28],
        [13, 12, 13, 12, 13, 115, 115, 115, 115, 12],
    ], solidTiles);
    const map01 = new MapScreen([
        [44, 45, 29, 28, 29, 28, 29, 35, 35, 28],
        [28, 29, 35, 7, 8, 9, 0, 2, 35, 12],
        [1, 2, 35, 23, 24, 25, 32, 18, 35, 28],
        [33, 17, 2, 35, 35, 35, 35, 16, 2, 12],
        [35, 16, 18, 35, 35, 35, 0, 17, 34, 28],
        [1, 17, 18, 115, 35, 115, 32, 34, 115, 12],
        [33, 33, 34, 35, 115, 35, 115, 115, 115, 28],
        [13, 12, 13, 12, 13, 115, 115, 115, 115, 12],
    ], solidTiles);
    const map11 = new MapScreen([
        [29, 28, 29, 28, 29, 115, 115, 115, 115, 28],
        [64, 64, 64, 64, 66, 115, 115, 115, 115, 12],
        [129, 147, 129, 129, 82, 12, 13, 112, 114, 28],
        [147, 129, 147, 129, 82, 28, 29, 125, 125, 12],
        [147, 147, 147, 147, 82, 35, 0, 17, 34, 28],
        [147, 147, 147, 147, 98, 64, 54, 100, 100, 53],
        [147, 147, 129, 147, 80, 84, 81, 100, 100, 69],
        [129, 129, 147, 129, 147, 147, 147, 147, 147, 147],
    ], solidTiles);

    const worldMap = new WorldMap(
        [
            [map00, map10],
            [map01, map11]
        ],
        new SpriteRenderer(ctx, backgroundAsset)
    );

    const inputManager = new InputManager();
    const lonk = new Lonk(200, 60, new SpriteRenderer(ctx, lonkAsset));
    const fpsDisplay = new FpsDisplay();
    const viewport = new Viewport(160, 0, ViewportMode.TILED);

    new Game(
        inputManager,
        lonk,
        worldMap,
        fpsDisplay,
        viewport,
        ctx,
    ).start();
});