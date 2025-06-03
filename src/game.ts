import { FpsDisplay } from "./fpsDisplay";
import { InputManager } from "./inputManager";
import { Lonk } from "./lonk";
import { MapTile } from "./mapTile";
import { Renderer } from "./renderer";
import { GameConfig } from "./config";

/**
 * The main Game class, orchestrating all game components and managing the game loop.
 */
export class Game {
    private inputManager: InputManager;
    private mapTile: MapTile;
    private lonk: Lonk;
    private fpsDisplay: FpsDisplay;
    private renderer: Renderer;

    private animationFrameId: number | null = null;
    private lastTime: DOMHighResTimeStamp = 0;
    private delta: number = 0;

    private frameCount: number = 0;
    private lastFpsUpdateTime: DOMHighResTimeStamp = 0;
    private currentFps: number = 0;

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
    }

    /**
     * Initializes and starts the game loop.
     */
    public start(): void {
        this.lastTime = performance.now();
        this.lastFpsUpdateTime = performance.now();
        this.delta = 0;
        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }

    /**
     * Stops the game loop.
     */
    public stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    private loop(now: DOMHighResTimeStamp): void {
        const elapsed = now - this.lastTime;
        this.lastTime = now;
        this.delta += Math.min(elapsed, GameConfig.MAX_DELTA_TIME);

        let updatesCount = 0;
        while (this.delta >= GameConfig.TIMESTEP && updatesCount < GameConfig.MAX_UPDATES_PER_FRAME) {
            this.update();
            this.delta -= GameConfig.TIMESTEP;
            updatesCount++;
        }

        if (updatesCount === GameConfig.MAX_UPDATES_PER_FRAME && this.delta >= GameConfig.TIMESTEP) {
            this.delta = 0;
        }

        const interpolation = this.delta / GameConfig.TIMESTEP;
        this.render(interpolation);

        this.frameCount++;
        if (now - this.lastFpsUpdateTime >= GameConfig.FPS_UPDATE_INTERVAL_MS) {
            this.currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdateTime = now;
            this.fpsDisplay.setFps(this.currentFps);
        }

        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }

    private update(): void {
        this.lonk.update(this.inputManager, this.mapTile);
    }

    private render(interpolation: number): void {
        this.renderer.draw([this.mapTile, this.lonk, this.fpsDisplay], interpolation);
    }
}