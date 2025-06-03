import { FpsDisplay } from "./fpsDisplay";
import { GameLoop } from "./gameLoop";
import { InputManager } from "./inputManager";
import { Lonk } from "./lonk";
import { MapTile } from "./mapTile";
import { Renderer } from "./renderer";

/**
 * The main Game class, orchestrating all game components.
 */
export class Game {
    private inputManager: InputManager;
    private mapTile: MapTile;
    private lonk: Lonk;
    private fpsDisplay: FpsDisplay;
    private renderer: Renderer;
    private gameLoop: GameLoop;

    /**
     * Creates an instance of Game.
     * @param inputManager The InputManager instance for handling user input.
     * @param lonk The Lonk instance representing the player character.
     * @param mapTile The MapTile instance representing the game map.
     * @param fpsDisplay The FpsDisplay instance representing the fps display.
     * @param renderer The Renderer instance for drawing game elements.
     */
    constructor(
        inputManager: InputManager,
        lonk: Lonk,
        mapTile: MapTile,
        fpsDisplay: FpsDisplay,
        renderer: Renderer,
    ) {
        this.inputManager = inputManager;
        this.lonk = lonk;
        this.mapTile = mapTile;
        this.fpsDisplay = fpsDisplay;
        this.renderer = renderer;

        this.gameLoop = new GameLoop(
            this.update.bind(this),
            this.render.bind(this),
            this.fpsDisplay.setFps.bind(this.fpsDisplay),
        );
    }

    /**
     * Initializes and starts the game loop.
     */
    public start(): void {
        this.gameLoop.start();
    }

    /**
     * Stops the game loop.
     */
    public stop(): void {
        this.gameLoop.stop();
    }

    private update(): void {
        this.lonk.update(this.inputManager, this.mapTile);
    }

    private render(interpolation: number): void {
        this.renderer.draw([this.mapTile, this.lonk, this.fpsDisplay], interpolation);
    }
}
