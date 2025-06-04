import { GameConfig } from "./config";

export enum ViewportMode {
    TILED = 'tiled',
    CENTERED = 'centered',
}

export class Viewport {
    private nextX: number = 0;
    private nextY: number = 0;
    private progress: number = 0;

    private static PROGRESS_STEP = 0.06;

    constructor(private x: number, private y: number, private mode: ViewportMode) { }

    public isTransitioning(): boolean {
        return this.progress > 0;
    }

    public getBoundingBox(): { minX: number, minY: number, maxX: number, maxY: number } {
        const minX = Math.round(this.x + (this.nextX - this.x) * this.progress);
        const minY = Math.round(this.y + (this.nextY - this.y) * this.progress);

        return {
            minX,
            minY,
            maxX: minX + GameConfig.MAP_WIDTH_PX - 1,
            maxY: minY + GameConfig.MAP_HEIGHT_PX - 1,
        };
    }

    public update(lonkPos: { x: number, y: number }): void {
        if (this.progress >= 1) {
            this.progress = 0;
            this.x = this.nextX;
            this.y = this.nextY;
            return;
        } else if (this.progress > 0) {
            this.progress += Viewport.PROGRESS_STEP;
            this.progress = Math.min(1, this.progress);
            return;
        }

        if (this.mode === ViewportMode.CENTERED) {
            this.x = Math.round(lonkPos.x - GameConfig.MAP_WIDTH_PX / 2 + GameConfig.SPRITE_WIDTH / 2);
            this.y = Math.round(lonkPos.y - GameConfig.MAP_HEIGHT_PX / 2 + GameConfig.SPRITE_HEIGHT / 2);
        } else {
            const x = Math.floor((lonkPos.x + GameConfig.SPRITE_WIDTH / 2) / GameConfig.MAP_WIDTH_PX) * GameConfig.MAP_WIDTH_PX;
            const y = Math.floor((lonkPos.y + GameConfig.SPRITE_HEIGHT / 2) / GameConfig.MAP_HEIGHT_PX) * GameConfig.MAP_HEIGHT_PX;

            if (x !== this.x || y != this.y) {
                this.progress += Viewport.PROGRESS_STEP;
                this.nextX = x;
                this.nextY = y;
            }
        }
    }
}