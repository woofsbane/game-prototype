import { GameConfig } from "./config";

export enum ViewportMode {
    TILED = 'tiled',
    CENTERED = 'centered',
}

export class Viewport {
    private x: number = 0;
    private y: number = 0;

    constructor(private mode: ViewportMode) { }

    public isTransitioning(): boolean {
        return false;
    }

    public getBoundingBox(): { minX: number, minY: number, maxX: number, maxY: number } {
        return {
            minX: this.x,
            minY: this.y,
            maxX: this.x + GameConfig.MAP_WIDTH_PX - 1,
            maxY: this.y + GameConfig.MAP_HEIGHT_PX - 1,
        };
    }

    public update(lonkPos: { x: number, y: number }): void {
        if (this.mode === ViewportMode.CENTERED) {
            this.x = Math.round(lonkPos.x - GameConfig.MAP_WIDTH_PX / 2 + GameConfig.SPRITE_WIDTH / 2);
            this.y = Math.round(lonkPos.y - GameConfig.MAP_HEIGHT_PX / 2 + GameConfig.SPRITE_HEIGHT / 2);
        } else {
            this.x = Math.floor((lonkPos.x + GameConfig.SPRITE_WIDTH / 2) / GameConfig.MAP_WIDTH_PX) * GameConfig.MAP_WIDTH_PX;
            this.y = Math.floor((lonkPos.y + GameConfig.SPRITE_HEIGHT / 2) / GameConfig.MAP_HEIGHT_PX) * GameConfig.MAP_HEIGHT_PX;
        }
    }
}