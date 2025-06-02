const TICKS_PER_SECOND = 30; // Simulation speed.
const TIMESTEP = 1000 / TICKS_PER_SECOND;
const MAX_DELTA_TIME = 250;
const MAX_UPDATES_PER_FRAME = 5;

class Game {
    constructor(canvasId) {
        /**
         * The game canvas.
         * @type {HTMLCanvasElement}
         */
        this.canvas = document.getElementById(canvasId);
        /**
         * The canvas 2D rendering context.
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = this.canvas.getContext('2d');

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
         * Timestamp for the last frame.
         * @type {{x: number, y: number}[]}
         */
        this.objects = [
            // Row 1
            { x: 0, y: 0 },
            { x: 2, y: 0 },
            { x: 4, y: 0 },
            { x: 6, y: 0 },
            { x: 8, y: 0 },
            { x: 10, y: 0 },

            // Row 2
            { x: 1, y: 1 },
            { x: 3, y: 1 },
            { x: 5, y: 1 },
            { x: 7, y: 1 },
            { x: 9, y: 1 },
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
    }

    update() {
        // Your game update logic here
    }

    render(interpolation) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'black';

        for (let i = 0; i < this.objects.length; i++) {
            const obj = this.objects[i];
            this.ctx.fillRect(obj.x * 16, obj.y * 16, 16, 16);
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
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
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
    const myGame = new Game('gameCanvas');
    myGame.start();
});