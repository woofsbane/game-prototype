import { GameConfig } from "./config";
import { MapScreen } from "./mapScreen";
import type { SpriteRenderer } from "./spriteRenderer";
import type { Viewport } from "./viewport";

export class WorldMap {
    constructor(private screens: MapScreen[][], private spriteRenderer: SpriteRenderer) { }

    /**
         * Checks for collision with solid background tiles at a given potential position.
         * @param potentialX - The potential X coordinate of Lonk.
         * @param potentialY - The potential Y coordinate of Lonk.
         * @returns True if a collision is detected, false otherwise.
         */
    public hasCollision(potentialX: number, potentialY: number): boolean {
        return false;

        // // Collision box adjusted for sprite (e.g., Lonk is 16x16 but collision is smaller)
        // const lonkLeft = potentialX + GameConfig.LONK_COLLISION_OFFSET_X;
        // const lonkTop = potentialY + GameConfig.LONK_COLLISION_OFFSET_Y;
        // const lonkRight = potentialX + GameConfig.SPRITE_WIDTH - GameConfig.LONK_COLLISION_OFFSET_X;
        // const lonkBottom = potentialY + GameConfig.SPRITE_HEIGHT - (GameConfig.LONK_COLLISION_HEIGHT_REDUCTION - GameConfig.LONK_COLLISION_OFFSET_Y);

        // // Determine the range of tiles Lonk is currently overlapping or about to overlap
        // const startTileX = Math.floor(lonkLeft / GameConfig.SPRITE_WIDTH);
        // const endTileX = Math.floor(lonkRight / GameConfig.SPRITE_WIDTH);
        // const startTileY = Math.floor(lonkTop / GameConfig.SPRITE_HEIGHT);
        // const endTileY = Math.floor(lonkBottom / GameConfig.SPRITE_HEIGHT);

        // for (let row = startTileY; row <= endTileY; row++) {
        //     for (let col = startTileX; col <= endTileX; col++) {
        //         // TODO: Get appropriate maptile dynamically
        //         if (mapTile.isTileSolid(col, row)) {
        //             return true;
        //         }
        //     }
        // }
        // return false;
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