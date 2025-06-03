import { GameConfig } from "./config";
import type { IDrawable } from "./renderer";

/**
 * Represents the game's background map and handles tile-related logic.
 */
export class MapScreen implements IDrawable {
    private tileset: number[][];
    private solidTiles: number[];
    private spritesheet: HTMLImageElement;

    /**
     * Creates an instance of MapTile.
     * @param tileset - The 2D array representing the game's background tiles.
     * @param solidTiles - An array of sprite IDs that are considered solid.
     * @param spritesheet - The spritesheet image for background tiles.
     */
    constructor(tileset: number[][], solidTiles: number[], spritesheet: HTMLImageElement) {
        this.tileset = tileset;
        this.solidTiles = solidTiles;
        this.spritesheet = spritesheet;
    }

    /**
     * Checks if a tile at the given coordinates is solid.
     * @param tileX - The X coordinate of the tile.
     * @param tileY - The Y coordinate of the tile.
     * @returns True if the tile is solid, false otherwise.
     */
    public isTileSolid(tileX: number, tileY: number): boolean {
        if (tileY >= 0 && tileY < this.tileset.length && tileX >= 0 && tileX < this.tileset[tileY].length) {
            const tileId = this.tileset[tileY][tileX];
            return this.solidTiles.includes(tileId);
        }
        return false;
    }

    /**
     * Draws the background tiles on the canvas.
     * @param ctx - The 2D rendering context of the canvas.
     */
    public draw(ctx: CanvasRenderingContext2D): void {
        const scaledSpriteWidth = GameConfig.SPRITE_WIDTH * GameConfig.CANVAS_SCALE;
        const scaledSpriteHeight = GameConfig.SPRITE_HEIGHT * GameConfig.CANVAS_SCALE;

        for (let y = 0; y < this.tileset.length; y++) {
            for (let x = 0; x < this.tileset[y].length; x++) {
                const { sx, sy } = this.getSpriteSourceCoords(this.tileset[y][x]);
                ctx.drawImage(
                    this.spritesheet,
                    sx, sy,
                    GameConfig.SPRITE_WIDTH, GameConfig.SPRITE_HEIGHT, // Source width and height (original sprite size)
                    x * scaledSpriteWidth, (y + GameConfig.GAME_BAR_HEIGHT) * scaledSpriteHeight,
                    scaledSpriteWidth, scaledSpriteHeight // Destination width and height (scaled)
                );
            }
        }
    }

    private getSpriteSourceCoords(spriteId: number): { sx: number; sy: number } {
        const sx = (spriteId * GameConfig.SPRITE_WIDTH) % this.spritesheet.width;
        const sy = Math.floor((spriteId * GameConfig.SPRITE_WIDTH) / this.spritesheet.width) * GameConfig.SPRITE_HEIGHT;
        return { sx, sy };
    }
}
