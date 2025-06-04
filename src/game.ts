import { GameConfig } from "./config";
import { FpsDisplay } from "./fpsDisplay";
import { InputManager } from "./inputManager";
import { Lonk } from "./lonk";
import type { Viewport } from "./viewport";
import { WorldMap } from "./worldMap";

/**
 * The main Game class, orchestrating all game components and managing the game loop.
 */
export class Game {
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
        private inputManager: InputManager,
        private lonk: Lonk,
        private worldMap: WorldMap,
        private fpsDisplay: FpsDisplay,
        private viewport: Viewport,
        private ctx: CanvasRenderingContext2D,
    ) { }

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

        this.render();

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
        if (!this.viewport.isTransitioning()) {
            this.lonk.update(this.inputManager, this.worldMap);
        }

        this.viewport.update(this.lonk.getPosition());
    }

    private render(): void {
        // Clear screen
        this.ctx.clearRect(0, 0, 160 * GameConfig.CANVAS_SCALE, 144 * GameConfig.CANVAS_SCALE); // TODO: Abstract this somewhere.

        // Translate to below game bar
        this.ctx.save();
        this.ctx.translate(0, GameConfig.GAME_BAR_HEIGHT * GameConfig.SPRITE_HEIGHT * GameConfig.CANVAS_SCALE);

        // Draw world map
        this.worldMap.draw(this.viewport);
        
        // Translate to the current viewport
        const { minX, minY } = this.viewport.getBoundingBox();
        this.ctx.save();
        this.ctx.translate(-minX * GameConfig.CANVAS_SCALE, -minY * GameConfig.CANVAS_SCALE);

        // Draw Lonk
        this.lonk.draw();

        // Translate back to the global position
        this.ctx.restore();
        this.ctx.restore();

        // Draw the FPS display
        this.fpsDisplay.draw(this.ctx);
    }
}
