import { GameConfig } from "./config";

export class SpriteRenderer {
    constructor(private ctx: CanvasRenderingContext2D, private sheet: HTMLImageElement) { }
    static SPRITE_SCALE_X = GameConfig.SPRITE_WIDTH * GameConfig.CANVAS_SCALE;
    static SPRITE_SCALE_Y = GameConfig.SPRITE_HEIGHT * GameConfig.CANVAS_SCALE;

    public draw(spriteId: number, xpos: number, ypos: number, flipHorizontal: boolean = false): void {
        const sx = (spriteId * GameConfig.SPRITE_WIDTH) % this.sheet.width;
        const sy = Math.floor((spriteId * GameConfig.SPRITE_WIDTH) / this.sheet.width) * GameConfig.SPRITE_HEIGHT;

        const xPosScaled = Math.round(xpos) * GameConfig.CANVAS_SCALE;
        const yPosScaled = Math.round(ypos) * GameConfig.CANVAS_SCALE;

        this.ctx.save();

        if (flipHorizontal) {
            // Translate to the center of the scaled sprite, scale horizontally, then draw
            this.ctx.translate(xPosScaled + SpriteRenderer.SPRITE_SCALE_X / 2, yPosScaled + SpriteRenderer.SPRITE_SCALE_Y / 2);
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                this.sheet,
                sx, sy,
                GameConfig.SPRITE_WIDTH, GameConfig.SPRITE_HEIGHT,
                -SpriteRenderer.SPRITE_SCALE_X / 2, -SpriteRenderer.SPRITE_SCALE_Y / 2,
                SpriteRenderer.SPRITE_SCALE_X, SpriteRenderer.SPRITE_SCALE_Y
            );
        }
        else {
            this.ctx.drawImage(
                this.sheet,
                sx, sy,
                GameConfig.SPRITE_WIDTH, GameConfig.SPRITE_HEIGHT,
                xPosScaled, yPosScaled,
                SpriteRenderer.SPRITE_SCALE_X, SpriteRenderer.SPRITE_SCALE_Y
            );
        }
        
        this.ctx.restore();
    }
}