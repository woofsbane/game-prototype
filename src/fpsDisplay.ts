import { GameConfig } from "./config";
import type { IDrawable } from "./renderer";

export class FpsDisplay implements IDrawable {
    private fps: number = 0;

    public setFps(fps: number) {
        this.fps = fps;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = 'red';
        // Adjust font size and position for scaled canvas
        ctx.font = `${5 * GameConfig.CANVAS_SCALE}px Arial`;
        ctx.textAlign = 'right';
        ctx.fillText(`FPS: ${this.fps}`,
            (GameConfig.MAP_WIDTH_PX - 5) * GameConfig.CANVAS_SCALE,
            5 * GameConfig.CANVAS_SCALE
        );
    }
}