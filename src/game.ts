import { AssetManager } from "./assetManager";
import { GameConfig } from "./config";
import { GameLoop } from "./gameLoop";
import { InputManager } from "./inputManager";
import { Lonk } from "./lonk";
import { MapTile } from "./mapTile";
import { Renderer } from "./renderer";

/**
 * The main Game class, orchestrating all game components.
 */
export class Game {
    private canvas: HTMLCanvasElement;
    private solidTiles: number[];
    private assetManager: AssetManager;
    private inputManager: InputManager;
    private mapTile: MapTile | null = null;
    private lonk: Lonk;
    private currentFps: number = 0;
    private renderer: Renderer | null = null;
    private gameLoop: GameLoop | null = null;

    /**
     * Creates an instance of Game.
     */
    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        if (!this.canvas) {
            throw new Error("Canvas element with ID 'gameCanvas' not found.");
        }

        this.solidTiles = [8, 11, 12, 13, 14, 15, 28, 29, 30, 31, 44, 45, 159];

        this.assetManager = new AssetManager();
        this.inputManager = new InputManager();

        this.assetManager.loadImage('background', 'tilesets/background.png');
        this.assetManager.loadImage('lonk', 'tilesets/lonk.png');

        this.lonk = new Lonk(75, 75); // Lonk's positions remain in the unscaled game coordinates
    }

    /**
     * Initializes and starts the game. This includes loading assets and
     * setting up the renderer and game loop.
     * @returns A promise that resolves when the game has started.
     */
    async start(): Promise<void> {
        try {
            await this.assetManager.loadAll();
            // Initialize MapTile after assets are loaded
            const backgroundAsset = this.assetManager.getAsset('background');
            const lonkAsset = this.assetManager.getAsset('lonk');

            if (!backgroundAsset || !lonkAsset) {
                throw new Error("Required assets (background or lonk) not loaded.");
            }

            this.mapTile = new MapTile(this.getInitialMapData(), this.solidTiles, backgroundAsset);
            this.renderer = new Renderer(this.canvas, lonkAsset);
            this.gameLoop = new GameLoop(
                this.update.bind(this),
                this.render.bind(this),
                (fps: number) => { this.currentFps = fps; }
            );
            this.gameLoop.start();
        } catch (error) {
            console.error("Game failed to start due to asset loading errors:", error);
        }
    }

    /**
     * Provides the initial map data. This could be loaded from a file in a real game.
     * @returns The 2D array representing the map.
     */
    private getInitialMapData(): number[][] {
        return [
            [44, 45, 29, 28, 29, 28, 29, 35, 35, 28],
            [28, 29, 35, 7, 8, 9, 0, 2, 35, 12],
            [1, 2, 35, 23, 24, 25, 32, 18, 35, 28],
            [33, 17, 2, 35, 35, 35, 35, 16, 2, 12],
            [35, 16, 18, 35, 35, 35, 0, 17, 34, 28],
            [1, 17, 18, 115, 35, 115, 32, 34, 115, 12],
            [33, 33, 34, 35, 115, 35, 115, 115, 115, 28],
            [13, 12, 13, 12, 13, 115, 115, 115, 115, 12],
        ];
    }

    /**
     * Stops the game loop.
     */
    stop(): void {
        if (this.gameLoop) {
            this.gameLoop.stop();
        }
    }

    /**
     * Updates the game state. This method is called at a fixed timestep.
     */
    update(): void {
        if (!this.mapTile) {
            console.error("MapTile is not initialized.");
            return;
        }
        // Pass unscaled canvas dimensions to Lonk's update for consistent game logic
        this.lonk.update(this.inputManager, this.mapTile,
            this.canvas.width / GameConfig.CANVAS_SCALE,
            this.canvas.height / GameConfig.CANVAS_SCALE - GameConfig.GAME_BAR_HEIGHT * GameConfig.SPRITE_HEIGHT);
        // Add more game update logic here
    }

    /**
     * Renders the game elements to the canvas.
     * @param interpolation - The interpolation factor (0 to 1) for smooth rendering between fixed updates.
     */
    render(interpolation: number): void {
        if (!this.renderer || !this.mapTile) {
            console.error("Renderer or MapTile is not initialized.");
            return;
        }
        this.renderer.clear();
        this.renderer.drawBackground(this.mapTile);
        this.renderer.drawLonk(this.lonk, interpolation);
        this.renderer.drawFPS(this.currentFps);
    }
}
