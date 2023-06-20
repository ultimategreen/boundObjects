import { GameObject } from "./GameObject";
import { CollisionEngine } from "./CollisionEngine";
import { Square, Circle } from "./Square";

export class GameWorld
{
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    gameObjects: GameObject[];
    secondsPassed: number;
    oldTimeStamp: number;
    collisionEngine: CollisionEngine;

    constructor(canvasId: string)
    {
        const maybeCanvasElement = document.getElementById(canvasId); 
        if (!maybeCanvasElement || !(maybeCanvasElement instanceof HTMLCanvasElement))
        {
            throw "null canvas";
        }
        this.canvas = maybeCanvasElement;

        const maybeCanvasRenderingContext2D = this.canvas.getContext("2d");
        if (!maybeCanvasRenderingContext2D)
        {
            throw "null context";
        }
        this.context = maybeCanvasRenderingContext2D;
        this.gameObjects = [
            new Square(this.context, 301, 600, 50, 50, 10, true),
            new Square(this.context, 352, 600, 50, 50, 10, true),
            new Square(this.context, 340, 300, 20, 20, 10, false, 0, 10),
        ];
        this.secondsPassed = 0;
        this.oldTimeStamp = 0;

        this.gameObjects.forEach((obj) => obj.update());
        this.collisionEngine = new CollisionEngine(this.gameObjects);

        this.gameObjects.forEach((obj) => obj.update());
        // Request an animation frame for the first time
        // The gameLoop() function will be called as a callback of this request

    }

    run ()
    {
        window.requestAnimationFrame(this.gameLoop);
    }

    gameLoop = () => {
        this.gameObjects.forEach((obj) => obj.update());

        this.collisionEngine.detectCollisionAtEdge();

        this.clearCanvas();

        this.gameObjects.forEach((obj) => obj.draw());

        // The loop function has reached it's end
        // Keep requesting new frames
        window.requestAnimationFrame(this.gameLoop);
    };

    clearCanvas() 
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
