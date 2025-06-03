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
    private inputManager: InputManager;
    private mapTile: MapTile; // Now definitely assigned in constructor
    private lonk: Lonk;
    private currentFps: number = 0;
    private renderer: Renderer; // Now definitely assigned in constructor
    private gameLoop: GameLoop; // Now definitely assigned in constructor

    /**
     * Creates an instance of Game.
     * @param canvas The HTMLCanvasElement to render the game on.
     * @param assetManager The AssetManager instance with loaded assets.
     * @param inputManager The InputManager instance for handling user input.
     * @param lonk The Lonk instance representing the player character.
     * @param mapTile The MapTile instance representing the game map.
     * @param renderer The Renderer instance for drawing game elements.
     * @param gameLoop The GameLoop instance for managing the game's update and render cycles.
     */
    constructor(
        canvas: HTMLCanvasElement,
        inputManager: InputManager,
        lonk: Lonk,
        mapTile: MapTile,
        renderer: Renderer,
        gameLoop: GameLoop
    ) {
        this.canvas = canvas;
        this.inputManager = inputManager;
        this.lonk = lonk;
        this.mapTile = mapTile;
        this.renderer = renderer;
        this.gameLoop = gameLoop;

        // Any other immediate setup that doesn't depend on async operations
        // and is specific to the Game's initial state
    }

    /**
     * Initializes and starts the game loop.
     */
    start(): void {
        this.gameLoop.start();
    }

    /**
     * Stops the game loop.
     */
    stop(): void {
        this.gameLoop.stop();
    }

    /**
     * Updates the game state. This method is called at a fixed timestep.
     */
    update(): void {
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
        this.renderer.clear();
        this.renderer.drawBackground(this.mapTile);
        this.renderer.drawLonk(this.lonk, interpolation);
        this.renderer.drawFPS(this.currentFps);
    }
}
