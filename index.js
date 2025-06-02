const TICKS_PER_SECOND = 30; // Simulation speed.
const TIMESTEP = 1000 / TICKS_PER_SECOND;
const MAX_DELTA_TIME = 250;
const MAX_UPDATES_PER_FRAME = 5;

class Game {
    constructor() {
        /**
         * The game canvas.
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.getElementById('gameCanvas');
        /**
         * The canvas 2D rendering context.
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.canvas.getContext('2d');

        /**
         * The background spritesheet image.
         * @type {HTMLImageElement}
         */
        this.backgroundSpritesheet = document.getElementById('backgroundSpritesheet');

        /**
         * Milliseconds since the last update.
         * @type {DOMHighResTimeStamp}
         */
        this.delta = 0;
        /**
         * Timestamp for the last frame.
         * @type {DOMHighResTimeStamp}
         */
        this.lastTime = 0;

        /**
         * Hard-coded background tileset with the ID of the sprite to render.
         * A spriteId of 0 would be the first sprite (top-left) in the spritesheet.
         * A spriteId of 1 would be the second sprite, and so on.
         * @type {number[][]}
         */
        this.background = [
            [159, 159, 159, 159, 159, 159, 159, 159, 159, 159],
            [44, 45, 29, 28, 29, 28, 29, 35, 35, 28],
            [28, 29, 35, 7, 8, 9, 0, 2, 35, 12],
            [1, 2, 35, 23, 24, 25, 32, 18, 35, 28],
            [33, 17, 2, 35, 35, 35, 35, 16, 2, 12],
            [35, 16, 18, 35, 35, 35, 0, 17, 34, 28],
            [1, 17, 18, 115, 35, 115, 32, 34, 115, 12],
            [33, 33, 34, 35, 115, 35, 115, 115, 115, 28],
            [13, 12, 13, 12, 13, 115, 115, 115, 115, 12],
        ];

        /**
         * Timestamp for the last frame.
         * @type {number}
         */
        this.frameCount = 0;
        /**
         * Timestamp for the last frame.
         * @type {DOMHighResTimeStamp}
         */
        this.lastFpsUpdateTime = 0;
        /**
         * Timestamp for the last frame.
         * @type {number}
         */
        this.currentFps = 0;

        // Sprite dimensions
        this.SPRITE_WIDTH = 16;
        this.SPRITE_HEIGHT = 16;
    }

    // Helper to get source x, y from a spriteId
    getSpriteSourceCoords(spriteId) {
        const sx = (spriteId * this.SPRITE_WIDTH) % this.backgroundSpritesheet.width;
        const sy = Math.floor((spriteId * this.SPRITE_WIDTH) / this.backgroundSpritesheet.width) * this.SPRITE_HEIGHT;

        return { sx, sy };
    }

    update() {
        // Your game update logic here
    }

    render(interpolation) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the background.
        for (let y = 0; y < this.background.length; y++) {
            for (let x = 0; x < this.background[y].length; x++) {
                const { sx, sy } = this.getSpriteSourceCoords(this.background[y][x]);

                // Draw the sprite
                this.ctx.drawImage(
                    this.backgroundSpritesheet, // Source image
                    sx, sy,             // Source x, y (top-left corner of the sprite on the spritesheet)
                    this.SPRITE_WIDTH,  // Source width
                    this.SPRITE_HEIGHT, // Source height
                    x * this.SPRITE_WIDTH, // Destination x on canvas (scale to 16x16)
                    y * this.SPRITE_HEIGHT, // Destination y on canvas (scale to 16x16)
                    this.SPRITE_WIDTH,  // Destination width on canvas
                    this.SPRITE_HEIGHT  // Destination height on canvas
                );
            }
        }

        // Display FPS in the top right corner
        this.ctx.fillStyle = 'red';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`FPS: ${this.currentFps}`, this.canvas.width - 10, 10);
    }

    start() {
        this.lastTime = performance.now();
        this.lastFpsUpdateTime = performance.now(); // Initialize FPS update time
        this.delta = 0;

        // Only start the game loop once the spritesheet is loaded
        if (this.backgroundSpritesheet.complete && this.backgroundSpritesheet.naturalWidth !== 0) {
            this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
        } else {
            // If the image is not yet loaded, wait for it
            this.backgroundSpritesheet.onload = () => {
                console.log("Spritesheet loaded!");
                this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
            };
            this.backgroundSpritesheet.onerror = () => {
                console.error("Failed to load spritesheet!");
                // Handle error, e.g., display an error message
            };
        }
    }

    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    gameLoop(now) {
        const elapsed = now - this.lastTime;
        this.lastTime = now;
        this.delta += Math.min(elapsed, MAX_DELTA_TIME); // Cap max delta when tab is inactive.

        let updatesCount = 0;

        while (this.delta >= TIMESTEP && updatesCount < MAX_UPDATES_PER_FRAME) {
            this.update();
            this.delta -= TIMESTEP;
            updatesCount++;
        }

        // Reset delta if we're running behind.
        if (updatesCount === MAX_UPDATES_PER_FRAME && this.delta >= TIMESTEP) {
            this.delta = 0;
        }

        // Interpolate for smooth movements.
        const interpolation = this.delta / TIMESTEP;
        this.render(interpolation);

        // FPS calculation (extract into a component)
        this.frameCount++;
        if (now - this.lastFpsUpdateTime >= 1000) { // Update once per second
            this.currentFps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsUpdateTime = now;
        }

        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const myGame = new Game();
    myGame.start();
});