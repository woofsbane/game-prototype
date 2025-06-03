import { Directions } from "./config";

/**
 * Manages keyboard input for the game.
 */
export class InputManager {
    private keys: { [key: string]: boolean } = {};
    private actionMap: { [key in Directions]: string } = {
        [Directions.UP]: 'w',
        [Directions.DOWN]: 's',
        [Directions.LEFT]: 'a',
        [Directions.RIGHT]: 'd',
    };

    constructor() {
        this.addEventListeners();
    }

    /**
     * Adds event listeners for keyboard keydown and keyup events.
     * @private
     */
    private addEventListeners(): void {
        document.addEventListener('keydown', (e: KeyboardEvent) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        document.addEventListener('keyup', (e: KeyboardEvent) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    /**
     * Checks if an abstract action (e.g., 'up', 'down') is currently active.
     * @param action - The action to check (e.g., Directions.UP, Directions.LEFT).
     * @returns True if any key mapped to the action is pressed, false otherwise.
     */
    isActive(action: Directions): boolean {
        return !!this.keys[this.actionMap[action]];
    }
}
