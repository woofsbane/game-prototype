export interface IDrawable {
    draw(ctx: CanvasRenderingContext2D, interpolation: number): void;
}

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

    public draw(objects: IDrawable[], interpolation: number) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < objects.length; i++) {
            objects[i].draw(this.ctx, interpolation);
        }
    }
}
