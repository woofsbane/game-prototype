export interface IDrawable {
    draw(ctx: CanvasRenderingContext2D, interpolation: number): void;
}

/**
 * Handles all rendering operations for the game.
 */
export class Renderer {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;

    /**
     * Creates an instance of Renderer.
     * @param canvas - The HTML canvas element to draw on.
     */
    constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
        this.ctx = ctx;
        this.ctx.imageSmoothingEnabled = false;

        this.width = width;
        this.height = height;
    }

    public draw(objects: IDrawable[], interpolation: number) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < objects.length; i++) {
            objects[i].draw(this.ctx, interpolation);
        }
    }
}
