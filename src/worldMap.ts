import { GameConfig } from "./config";
import { MapScreen } from "./mapScreen";
import type { SpriteRenderer } from "./spriteRenderer";
import type { Viewport } from "./viewport";

export class WorldMap {
    constructor(private screens: MapScreen[][], private spriteRenderer: SpriteRenderer) { }

    /**
     * Checks for collision with solid background tiles at a given potential position and collision boundaries.
     * @param lonkLeft - The left boundary of Lonk's collision box.
     * @param lonkTop - The top boundary of Lonk's collision box.
     * @param lonkRight - The right boundary of Lonk's collision box.
     * @param lonkBottom - The bottom boundary of Lonk's collision box.
     * @returns True if a collision is detected, false otherwise.
     */
    public hasCollision(lonkLeft: number, lonkTop: number, lonkRight: number, lonkBottom: number): boolean {
        // Determine the range of screens Lonk's collision box potentially overlaps
        const startScreenX = Math.floor(lonkLeft / GameConfig.MAP_WIDTH_PX);
        const endScreenX = Math.floor(lonkRight / GameConfig.MAP_WIDTH_PX);
        const startScreenY = Math.floor(lonkTop / GameConfig.MAP_HEIGHT_PX);
        const endScreenY = Math.floor(lonkBottom / GameConfig.MAP_HEIGHT_PX);

        // Iterate through all potentially overlapping screens
        for (let sY = startScreenY; sY <= endScreenY; sY++) {
            for (let sX = startScreenX; sX <= endScreenX; sX++) {
                // Check if screen coordinates are within valid bounds of the world map
                if (sY < 0 || sY >= this.screens.length || sX < 0 || sX >= (this.screens[0]?.length || 0)) {
                    // If Lonk is trying to move into an area outside the defined world map, consider it a collision.
                    return true;
                }

                const currentMapScreen = this.screens[sY][sX];

                // Calculate tile coordinates relative to the current screen's top-left corner
                const relativeLonkLeft = lonkLeft - (sX * GameConfig.MAP_WIDTH_PX);
                const relativeLonkTop = lonkTop - (sY * GameConfig.MAP_HEIGHT_PX);
                const relativeLonkRight = lonkRight - (sX * GameConfig.MAP_WIDTH_PX);
                const relativeLonkBottom = lonkBottom - (sY * GameConfig.MAP_HEIGHT_PX);

                // Determine the range of tiles Lonk is currently overlapping or about to overlap within THIS screen
                const startTileX = Math.floor(relativeLonkLeft / GameConfig.SPRITE_WIDTH);
                const endTileX = Math.floor(relativeLonkRight / GameConfig.SPRITE_WIDTH);
                const startTileY = Math.floor(relativeLonkTop / GameConfig.SPRITE_HEIGHT);
                const endTileY = Math.floor(relativeLonkBottom / GameConfig.SPRITE_HEIGHT);

                // Iterate through the tiles within this specific map screen
                for (let tileY = startTileY; tileY <= endTileY; tileY++) {
                    for (let tileX = startTileX; tileX <= endTileX; tileX++) {
                        // Check for collision within the current map screen.
                        // isTileSolid will handle bounds checking for tiles within its own screen.
                        if (currentMapScreen.isTileSolid(tileX, tileY)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    public draw(viewport: Viewport): void {
        const { minX, minY, maxX, maxY } = viewport.getBoundingBox();
        const minScreenX = Math.max(Math.floor(minX / GameConfig.MAP_WIDTH_PX), 0);
        const minScreenY = Math.max(Math.floor(minY / GameConfig.MAP_HEIGHT_PX), 0);
        const maxScreenX = Math.min(Math.ceil(maxX / GameConfig.MAP_WIDTH_PX) - 1, this.screens[0].length - 1);
        const maxScreenY = Math.min(Math.ceil(maxY / GameConfig.MAP_HEIGHT_PX) - 1, this.screens.length - 1);

        for (let x = minScreenX; x <= maxScreenX; x++) {
            for (let y = minScreenY; y <= maxScreenY; y++) {
                const deltaX = (x * GameConfig.MAP_WIDTH_PX - minX) * GameConfig.CANVAS_SCALE;
                const deltaY = (y * GameConfig.MAP_HEIGHT_PX - minY) * GameConfig.CANVAS_SCALE;
                this.spriteRenderer.translate(deltaX, deltaY);
                this.screens[y][x].draw(this.spriteRenderer);
                this.spriteRenderer.restore();
            }
        }
    }
}