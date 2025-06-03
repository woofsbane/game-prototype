import { Game } from "./game";
import "./style.css";

// Entry point: Initialize and start the game when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', () => {
    const myGame = new Game();
    myGame.start();
});
