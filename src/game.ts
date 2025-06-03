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
    private currentFps: number = 0;
    private renderer: Renderer;
    private gameLoop: GameLoop;

    /**
     * Creates an instance of Game.
     * @param inputManager The InputManager instance for handling user input.
     * @param lonk The Lonk instance representing the player character.
     * @param mapTile The MapTile instance representing the game map.
     * @param renderer The Renderer instance for drawing game elements.
     */
    constructor(
        inputManager: InputManager,
        lonk: Lonk,
        mapTile: MapTile,
        renderer: Renderer,
    ) {
        this.inputManager = inputManager;
        this.lonk = lonk;
        this.mapTile = mapTile;
        this.renderer = renderer;

        this.gameLoop = new GameLoop(
            this.update.bind(this),
            this.render.bind(this),
            (fps: number) => this.currentFps = fps,
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
        this.renderer.clear();
        this.renderer.drawBackground(this.mapTile);
        this.renderer.drawLonk(this.lonk, interpolation);
        this.renderer.drawFPS(this.currentFps);
    }
}
