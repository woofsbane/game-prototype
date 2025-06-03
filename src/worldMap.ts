import { Directions, GameConfig } from "./config";
import type { Lonk } from "./lonk";
import { MapScreen } from "./mapScreen";
import type { IDrawable } from "./renderer";
import type { SpriteRenderer } from "./spriteRenderer";

export class WorldMap implements IDrawable {
    private transitionProgress: number = 0;
    private newX = 0;
    private newY = 0;
    private static TRANSITION_STEP = 6;

    constructor(private screens: MapScreen[][], private x: number, private y: number, private spriteRenderer: SpriteRenderer) { }

    public getScreen(): MapScreen {
        return this.screens[this.y][this.x];
    }

    private getNewScreen(): MapScreen {
        return this.screens[this.newY][this.newX];
    }

    public isTransitioning(): boolean {
        return this.transitionProgress > 0;
    }

    public changeScreens(direction: Directions | undefined): boolean {
        switch (direction) {
            case Directions.UP:
                this.newY = Math.max(0, this.y - 1);
                this.newX = this.x;
                this.transitionProgress += WorldMap.TRANSITION_STEP;
                return true;
            case Directions.DOWN:
                this.newY = Math.min(this.y + 1, this.screens[0].length - 1);
                this.newX = this.x;
                this.transitionProgress += WorldMap.TRANSITION_STEP;
                return true;
            case Directions.LEFT:
                this.newX = Math.max(0, this.x - 1);
                this.newY = this.y;
                this.transitionProgress += WorldMap.TRANSITION_STEP;
                return true;
            case Directions.RIGHT:
                this.newX = Math.min(this.x + 1, this.screens.length - 1);
                this.newY = this.y;
                this.transitionProgress += WorldMap.TRANSITION_STEP;
                return true;
        }

        return false;
    }

    public update(lonk: Lonk): void {
        if (this.transitionProgress >= 100) {
            this.getScreen().setProgress(0, 0);
            this.getNewScreen().setProgress(0, 0);
            lonk.setProgress(0, 0);
            this.x = this.newX;
            this.y = this.newY;
            this.transitionProgress = 0;
        } else if (this.transitionProgress > 0) {
            this.transitionProgress += WorldMap.TRANSITION_STEP;
            this.transitionProgress = Math.min(this.transitionProgress, 100);

            this.getScreen().setProgress(
                ((this.transitionProgress * (this.x - this.newX)) / 100 * GameConfig.MAP_WIDTH_PX),
                ((this.transitionProgress * (this.y - this.newY)) / 100 * GameConfig.MAP_HEIGHT_PX),
            );

            this.getNewScreen().setProgress(
                ((this.transitionProgress - 100) * (this.x - this.newX)) / 100 * GameConfig.MAP_WIDTH_PX,
                ((this.transitionProgress - 100) * (this.y - this.newY)) / 100 * GameConfig.MAP_HEIGHT_PX,
            );

            lonk.setProgress(
                (this.transitionProgress * (this.x - this.newX)) / 100 * (GameConfig.MAP_WIDTH_PX - GameConfig.SPRITE_WIDTH),
                (this.transitionProgress * (this.y - this.newY)) / 100 * (GameConfig.MAP_HEIGHT_PX - GameConfig.SPRITE_HEIGHT),
            );
        }
    }

    public draw(): void {
        this.getScreen().draw(this.spriteRenderer);
        if (this.transitionProgress > 0) {
            this.getNewScreen().draw(this.spriteRenderer);
        }
    }
}