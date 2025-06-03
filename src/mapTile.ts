import { GameConfig } from "./config";

/**
 * Represents the game's background map and handles tile-related logic.
 */
export class MapTile {
    private mapData: number[][];
    private solidTiles: number[];
    private spritesheet: HTMLImageElement;

    /**
     * Creates an instance of MapTile.
     * @param mapData - The 2D array representing the game's background tiles.
     * @param solidTiles - An array of sprite IDs that are considered solid.
     * @param spritesheet - The spritesheet image for background tiles.
     */
    constructor(mapData: number[][], solidTiles: number[], spritesheet: HTMLImageElement) {
        this.mapData = mapData;
        this.solidTiles = solidTiles;
        this.spritesheet = spritesheet;
    }

    /**
     * Gets the map data.
     * @returns The 2D array of map data.
     */
    getMapData(): number[][] {
        return this.mapData;
    }

    /**
     * Checks if a tile at the given coordinates is solid.
     * @param tileX - The X coordinate of the tile.
     * @param tileY - The Y coordinate of the tile.
     * @returns True if the tile is solid, false otherwise.
     */
    isTileSolid(tileX: number, tileY: number): boolean {
        if (tileY >= 0 && tileY < this.mapData.length && tileX >= 0 && tileX < this.mapData[tileY].length) {
            const tileId = this.mapData[tileY][tileX];
            return this.solidTiles.includes(tileId);
        }
        return false;
    }

    /**
     * Calculates the source X and Y coordinates on the spritesheet for a given sprite ID.
     * @param spriteId - The ID of the sprite.
     * @returns An object containing the source X (sx) and source Y (sy) coordinates.
     */
    getSpriteSourceCoords(spriteId: number): { sx: number; sy: number } {
        const sx = (spriteId * GameConfig.SPRITE_WIDTH) % this.spritesheet.width;
        const sy = Math.floor((spriteId * GameConfig.SPRITE_WIDTH) / this.spritesheet.width) * GameConfig.SPRITE_HEIGHT;
        return { sx, sy };
    }

    /**
     * Draws the background tiles on the canvas.
     * @param ctx - The 2D rendering context of the canvas.
     */
    draw(ctx: CanvasRenderingContext2D): void {
        const scaledSpriteWidth = GameConfig.SPRITE_WIDTH * GameConfig.CANVAS_SCALE;
        const scaledSpriteHeight = GameConfig.SPRITE_HEIGHT * GameConfig.CANVAS_SCALE;

        for (let y = 0; y < this.mapData.length; y++) {
            for (let x = 0; x < this.mapData[y].length; x++) {
                const { sx, sy } = this.getSpriteSourceCoords(this.mapData[y][x]);
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
}
