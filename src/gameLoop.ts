import { GameConfig } from "./config";

/**
 * Manages the main game loop, handling updates and rendering at a fixed timestep.
 */
export class GameLoop {
    private updateCallback: () => void;
    private renderCallback: (interpolation: number) => void;
    private fpsCallback: (fps: number) => void;

    private animationFrameId: number | null = null;
    private lastTime: DOMHighResTimeStamp = 0;
    private delta: number = 0;

    private frameCount: number = 0;
    private lastFpsUpdateTime: DOMHighResTimeStamp = 0;
    private currentFps: number = 0;

    /**
     * Creates an instance of GameLoop.
     * @param updateCallback - The function to call for game logic updates.
     * @param renderCallback - The function to call for rendering.
     * @param fpsCallback - The function to call when FPS updates.
     */
    constructor(updateCallback: () => void, renderCallback: (interpolation: number) => void, fpsCallback: (fps: number) => void) {
        this.updateCallback = updateCallback;
        this.renderCallback = renderCallback;
        this.fpsCallback = fpsCallback;
    }

    /**
     * Starts the game loop.
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
            this.updateCallback();
            this.delta -= GameConfig.TIMESTEP;
            updatesCount++;
        }

        if (updatesCount === GameConfig.MAX_UPDATES_PER_FRAME && this.delta >= GameConfig.TIMESTEP) {
            this.delta = 0;
        }

        const interpolation = this.delta / GameConfig.TIMESTEP;
        this.renderCallback(interpolation);

        this.frameCount++;
        if (now - this.lastFpsUpdateTime >= GameConfig.FPS_UPDATE_INTERVAL_MS) {
            this.currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdateTime = now;
            this.fpsCallback(this.currentFps);
        }

        this.animationFrameId = requestAnimationFrame(this.loop.bind(this));
    }
}
