import { GameConfig } from "./config";
import { Lonk } from "./lonk";
import { MapTile } from "./mapTile";

/**
 * Handles all rendering operations for the game.
 */
export class Renderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    /**
     * Creates an instance of Renderer.
     * @param canvas - The HTML canvas element to draw on.
     */
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error("Could not get 2D rendering context for canvas.");
        }
        this.ctx = ctx;

        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * Clears the entire canvas.
     */
    public clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Draws the background tiles using the MapTile instance.
     * @param mapTile - The MapTile instance to draw.
     */
    public drawBackground(mapTile: MapTile): void {
        mapTile.draw(this.ctx);
    }

    /**
     * Draws the Lonk character on the canvas.
     * @param lonk - The Lonk instance to draw.
     * @param interpolation - The interpolation factor (0 to 1) for smooth rendering.
     */
    public drawLonk(lonk: Lonk, interpolation: number): void {
        lonk.draw(this.ctx, interpolation);
    }

    /**
     * Draws the current Frames Per Second (FPS) on the canvas.
     * @param fps - The current FPS value.
     */
    public drawFPS(fps: number): void {
        this.ctx.fillStyle = 'red';
        // Adjust font size and position for scaled canvas
        this.ctx.font = `${5 * GameConfig.CANVAS_SCALE}px Arial`;
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`FPS: ${fps}`,
            this.canvas.width - (5 * GameConfig.CANVAS_SCALE),
            5 * GameConfig.CANVAS_SCALE
        );
    }
}
