import { Directions, GameConfig } from "./config";
import { InputManager } from "./inputManager";
import { MapScreen } from "./mapScreen";
import type { IDrawable } from "./renderer";

/**
 * Defines the sprite sheet frame numbers for Lonk's animations.
 */
const enum LonkSprite {
    DOWN = 0,
    UP = 1,
    LEFT_FRAME1 = 2,
    LEFT_FRAME2 = 3,
}

/**
 * Represents the main player character, Lonk.
 */
export class Lonk implements IDrawable {
    public x: number;
    public y: number;
    public prevX: number;
    public prevY: number;
    private speed: number;
    public direction: Directions;
    public frame: 0 | 1;
    private frameDelay: number;
    private frameCounter: number;
    private spritesheet: HTMLImageElement;

    /**
     * Creates an instance of Lonk.
     * @param x - The initial X coordinate of Lonk.
     * @param y - The initial Y coordinate of Lonk.
     */
    constructor(x: number, y: number, spritesheet: HTMLImageElement) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.speed = 2;
        this.direction = Directions.DOWN;
        this.frame = 0;
        this.frameDelay = 3;
        this.frameCounter = 0;
        this.spritesheet = spritesheet;
    }

    /**
     * Updates Lonk's position and animation based on input.
     * @param inputManager - The input manager instance.
     * @param mapTile - The MapTile instance for collision checking.
     * @param canvasWidth - The width of the game canvas (unscaled).
     * @param canvasHeight - The height of the game canvas (unscaled).
     */
    public update(inputManager: InputManager, mapTile: MapScreen): void {
        this.prevX = this.x;
        this.prevY = this.y;

        let moveX = 0;
        let moveY = 0;

        if (inputManager.isActive(Directions.UP)) {
            moveY -= this.speed;
        } else if (inputManager.isActive(Directions.DOWN)) {
            moveY += this.speed;
        }

        if (inputManager.isActive(Directions.LEFT)) {
            moveX -= this.speed;
        } else if (inputManager.isActive(Directions.RIGHT)) {
            moveX += this.speed;
        }

        // Set direction based on priority: Left/Right takes precedence over Up/Down
        if (inputManager.isActive(Directions.LEFT)) {
            this.direction = Directions.LEFT;
        } else if (inputManager.isActive(Directions.RIGHT)) {
            this.direction = Directions.RIGHT;
        } else if (inputManager.isActive(Directions.UP)) {
            this.direction = Directions.UP;
        } else if (inputManager.isActive(Directions.DOWN)) {
            this.direction = Directions.DOWN;
        }

        // Normalize diagonal movement
        if (moveX !== 0 && moveY !== 0) {
            const diagonalSpeed = Math.sqrt(2);
            moveX /= diagonalSpeed;
            moveY /= diagonalSpeed;
        }

        // Clamp potential new position to unscaled canvas bounds
        const newX = Math.max(0, Math.min(this.x + moveX, GameConfig.MAP_WIDTH_PX - GameConfig.SPRITE_WIDTH));
        const newY = Math.max(0, Math.min(this.y + moveY, GameConfig.MAP_HEIGHT_PX - GameConfig.SPRITE_HEIGHT));

        // Collision detection
        const noCollisionX = !this.willCollideWithMap(newX, this.y, mapTile);
        const noCollisionY = !this.willCollideWithMap(this.x, newY, mapTile);
        if (noCollisionX && noCollisionY) {
            this.x = newX;
            this.y = newY;
        }

        // Only animate if Lonk actually moved AND didn't hit a wall
        if ((moveX !== 0 || moveY !== 0) && noCollisionX && noCollisionY) {
            this.frameCounter++;
            if (this.frameCounter >= this.frameDelay) {
                this.frameCounter = 0;
                this.frame = (this.frame + 1) % 2 as 0 | 1;
            }
        }
    }

    /**
     * Checks for collision with solid background tiles at a given potential position.
     * @param potentialX - The potential X coordinate of Lonk.
     * @param potentialY - The potential Y coordinate of Lonk.
     * @param mapTile - The MapTile instance for collision checking.
     * @returns True if a collision is detected, false otherwise.
     */
    private willCollideWithMap(potentialX: number, potentialY: number, mapTile: MapScreen): boolean {
        // Collision box adjusted for sprite (e.g., Lonk is 16x16 but collision is smaller)
        const lonkLeft = potentialX + GameConfig.LONK_COLLISION_OFFSET_X;
        const lonkTop = potentialY + GameConfig.LONK_COLLISION_OFFSET_Y;
        const lonkRight = potentialX + GameConfig.SPRITE_WIDTH - GameConfig.LONK_COLLISION_OFFSET_X;
        const lonkBottom = potentialY + GameConfig.SPRITE_HEIGHT - (GameConfig.LONK_COLLISION_HEIGHT_REDUCTION - GameConfig.LONK_COLLISION_OFFSET_Y);

        // Determine the range of tiles Lonk is currently overlapping or about to overlap
        const startTileX = Math.floor(lonkLeft / GameConfig.SPRITE_WIDTH);
        const endTileX = Math.floor(lonkRight / GameConfig.SPRITE_WIDTH);
        const startTileY = Math.floor(lonkTop / GameConfig.SPRITE_HEIGHT);
        const endTileY = Math.floor(lonkBottom / GameConfig.SPRITE_HEIGHT);

        for (let row = startTileY; row <= endTileY; row++) {
            for (let col = startTileX; col <= endTileX; col++) {
                if (mapTile.isTileSolid(col, row)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Draws Lonk on the canvas with interpolation.
     * @param ctx - The 2D rendering context of the canvas.
     * @param lonkSpritesheet - The spritesheet image for Lonk.
     * @param interpolation - The interpolation factor (0 to 1) for smooth rendering.
     */
    public draw(ctx: CanvasRenderingContext2D, interpolation: number): void {
        let sourceX = 0;
        let flipHorizontal = false;

        switch (this.direction) {
            case Directions.DOWN:
                sourceX = LonkSprite.DOWN * GameConfig.SPRITE_WIDTH;
                flipHorizontal = this.frame === 1;
                break;
            case Directions.UP:
                sourceX = LonkSprite.UP * GameConfig.SPRITE_WIDTH;
                flipHorizontal = this.frame === 1;
                break;
            case Directions.LEFT:
                sourceX = (this.frame + LonkSprite.LEFT_FRAME1) * GameConfig.SPRITE_WIDTH;
                break;
            case Directions.RIGHT:
                sourceX = (this.frame + LonkSprite.LEFT_FRAME1) * GameConfig.SPRITE_WIDTH;
                flipHorizontal = true;
                break;
        }

        // Calculate interpolated position (unscaled) and round to the nearest integer
        const interpolatedX = Math.round(this.prevX + (this.x - this.prevX) * interpolation);
        const interpolatedY = Math.round(this.prevY + (this.y - this.prevY) * interpolation);

        // Apply scaling for drawing and ensure integer pixel positions
        const scaledX = interpolatedX * GameConfig.CANVAS_SCALE;
        const scaledY = (interpolatedY + GameConfig.GAME_BAR_HEIGHT * GameConfig.SPRITE_HEIGHT) * GameConfig.CANVAS_SCALE;
        const scaledSpriteWidth = GameConfig.SPRITE_WIDTH * GameConfig.CANVAS_SCALE;
        const scaledSpriteHeight = GameConfig.SPRITE_HEIGHT * GameConfig.CANVAS_SCALE;

        ctx.save();
        if (flipHorizontal) {
            // Translate to the center of the scaled sprite, scale horizontally, then draw
            ctx.translate(scaledX + scaledSpriteWidth / 2, scaledY + scaledSpriteHeight / 2);
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.spritesheet,
                sourceX, 0,
                GameConfig.SPRITE_WIDTH, GameConfig.SPRITE_HEIGHT, // Source (unscaled)
                -scaledSpriteWidth / 2, -scaledSpriteHeight / 2,
                scaledSpriteWidth, scaledSpriteHeight // Destination (scaled)
            );
        } else {
            ctx.drawImage(
                this.spritesheet,
                sourceX, 0,
                GameConfig.SPRITE_WIDTH, GameConfig.SPRITE_HEIGHT, // Source (unscaled)
                scaledX, scaledY, // Destination (scaled)
                scaledSpriteWidth, scaledSpriteHeight // Destination (scaled)
            );
        }
        ctx.restore();
    }
}
