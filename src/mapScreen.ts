import { GameConfig } from "./config";
import { SpriteRenderer } from "./spriteRenderer";

/**
 * Represents the game's background map and handles tile-related logic.
 */
export class MapScreen {
    /**
     * Creates an instance of MapTile.
     * @param tileset - The 2D array representing the game's background tiles.
     * @param solidTiles - An array of sprite IDs that are considered solid.
     * @param spritesheet - The spritesheet image for background tiles.
     */
    constructor(private tileset: number[][], private solidTiles: number[]) { }

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
    public draw(spriteRenderer: SpriteRenderer): void {
        for (let y = 0; y < this.tileset.length; y++) {
            for (let x = 0; x < this.tileset[y].length; x++) {
                spriteRenderer.draw(this.tileset[y][x], x * GameConfig.SPRITE_WIDTH, y * GameConfig.SPRITE_HEIGHT);
            }
        }
    }
}
