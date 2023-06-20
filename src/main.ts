import { GameWorld } from "./GameWorld";

window.onload = () =>
{
    const gameWorld = new GameWorld("canvas");

    gameWorld.run();
};
