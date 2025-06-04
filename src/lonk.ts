import { Directions } from "./config";
import { InputManager } from "./inputManager";
import type { SpriteRenderer } from "./spriteRenderer";
import type { WorldMap } from "./worldMap";

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
export class Lonk {
    private speed: number;
    public direction: Directions;
    public frame: 0 | 1;
    private frameDelay: number;
    private frameCounter: number;

    /**
     * Creates an instance of Lonk.
     * @param x - The initial X coordinate of Lonk.
     * @param y - The initial Y coordinate of Lonk.
     */
    constructor(private x: number, private y: number, private spriteRenderer: SpriteRenderer) {
        this.speed = 2;
        this.direction = Directions.DOWN;
        this.frame = 0;
        this.frameDelay = 3;
        this.frameCounter = 0;
    }

    public getPosition(): { x: number, y: number } {
        return { x: this.x, y: this.y };
    }

    /**
     * Updates Lonk's position and animation based on input.
     * @param inputManager - The input manager instance.
     * @param mapTile - The MapTile instance for collision checking.
     */
    public update(inputManager: InputManager, worldMap: WorldMap): void {
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

        const newX = this.x + moveX;
        const newY = this.y + moveY;

        // Collision detection
        const noCollisionX = !worldMap.hasCollision(newX, this.y);
        if (noCollisionX) {
            this.x = newX;
        }

        const noCollisionY = !worldMap.hasCollision(this.x, newY);
        if (noCollisionY) {
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
     * Draws Lonk on the canvas with interpolation.
     * @param ctx - The 2D rendering context of the canvas.
     * @param lonkSpritesheet - The spritesheet image for Lonk.
     * @param interpolation - The interpolation factor (0 to 1) for smooth rendering.
     */
    public draw(): void {
        let spriteId = 0;
        let flipHorizontal = false;

        switch (this.direction) {
            case Directions.DOWN:
                spriteId = LonkSprite.DOWN;
                flipHorizontal = this.frame === 1;
                break;
            case Directions.UP:
                spriteId = LonkSprite.UP;
                flipHorizontal = this.frame === 1;
                break;
            case Directions.LEFT:
                spriteId = this.frame + LonkSprite.LEFT_FRAME1;
                break;
            case Directions.RIGHT:
                spriteId = this.frame + LonkSprite.LEFT_FRAME1;
                flipHorizontal = true;
                break;
        }

        this.spriteRenderer.draw(spriteId, this.x, this.y, flipHorizontal);
    }
}
