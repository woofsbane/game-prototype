import { Directions, GameConfig } from "./config";
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
     * Calculates Lonk's collision boundaries at a given potential position.
     * @param potentialX - The potential X coordinate of Lonk.
     * @param potentialY - The potential Y coordinate of Lonk.
     * @returns An object containing the left, top, right, and bottom collision boundaries.
     */
    private getCollisionBounds(potentialX: number, potentialY: number): { lonkLeft: number, lonkTop: number, lonkRight: number, lonkBottom: number } {
        const lonkLeft = potentialX + GameConfig.LONK_COLLISION_OFFSET_X;
        const lonkTop = potentialY + GameConfig.LONK_COLLISION_OFFSET_Y;
        const lonkRight = potentialX + GameConfig.SPRITE_WIDTH - GameConfig.LONK_COLLISION_OFFSET_X;
        const lonkBottom = potentialY + GameConfig.SPRITE_HEIGHT - (GameConfig.LONK_COLLISION_HEIGHT_REDUCTION - GameConfig.LONK_COLLISION_OFFSET_Y);
        return { lonkLeft, lonkTop, lonkRight, lonkBottom };
    }

    /**
     * Updates Lonk's position and animation based on input.
     * @param inputManager - The input manager instance.
     * @param worldMap - The WorldMap instance for collision checking.
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

        // Collision detection for X movement
        const { lonkLeft: xLonkLeft, lonkTop: xLonkTop, lonkRight: xLonkRight, lonkBottom: xLonkBottom } = this.getCollisionBounds(newX, this.y);
        const noCollisionX = !worldMap.hasCollision(xLonkLeft, xLonkTop, xLonkRight, xLonkBottom);
        if (noCollisionX) {
            this.x = newX;
        }

        // Collision detection for Y movement
        const { lonkLeft: yLonkLeft, lonkTop: yLonkTop, lonkRight: yLonkRight, lonkBottom: yLonkBottom } = this.getCollisionBounds(this.x, newY);
        const noCollisionY = !worldMap.hasCollision(yLonkLeft, yLonkTop, yLonkRight, yLonkBottom);
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
     * Draws Lonk on the canvas.
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