/**
 * Defines the configuration for the game.
 */
export interface GlobalConfig {
    readonly TIMESTEP: number;
    readonly MAX_DELTA_TIME: number;
    readonly MAX_UPDATES_PER_FRAME: number;
    readonly SPRITE_WIDTH: number;
    readonly SPRITE_HEIGHT: number;
    readonly FPS_UPDATE_INTERVAL_MS: number;
    readonly CANVAS_SCALE: number;
    readonly LONK_COLLISION_OFFSET_X: number;
    readonly LONK_COLLISION_OFFSET_Y: number;
    readonly LONK_COLLISION_WIDTH_REDUCTION: number;
    readonly LONK_COLLISION_HEIGHT_REDUCTION: number;
    readonly GAME_BAR_HEIGHT: number;
}

export const GameConfig: GlobalConfig = Object.freeze({
    TIMESTEP: 1000 / 30,
    MAX_DELTA_TIME: 250,
    MAX_UPDATES_PER_FRAME: 5,
    SPRITE_WIDTH: 16,
    SPRITE_HEIGHT: 16,
    FPS_UPDATE_INTERVAL_MS: 1000,
    CANVAS_SCALE: 6,
    LONK_COLLISION_OFFSET_X: 4,
    LONK_COLLISION_OFFSET_Y: 6,
    LONK_COLLISION_WIDTH_REDUCTION: 8, // 4 from each side (16 - 8 = 8 actual width)
    LONK_COLLISION_HEIGHT_REDUCTION: 8, // 6 from top + 2 from bottom (16 - 8 = 8 actual height)
    GAME_BAR_HEIGHT: 1,
});

/**
 * Defines the cardinal directions as immutable constants.
 * @readonly
 * @enum {string}
 */
export enum Directions {
    UP = 'up',
    DOWN = 'down',
    LEFT = 'left',
    RIGHT = 'right'
}
