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
        this.secondsPassed = 0;
        this.oldTimeStamp = 0;

        this.gameObjects = [
            new Circle(this.context, 599, 200, 15, 20, false, 1, 0),
            new Square(this.context, 301, 400, 200, 50, 10, true),
            new Square(this.context, 600, 800, 50, 200, 10, true),

            new Square(this.context, 300, 600, 50, 500, 10, true),
            new Square(this.context, 0, 100, 300, 10, 10, true),
        ];
        this.gameObjects.forEach((obj) => obj.update());
        this.collisionEngine = new CollisionEngine(this.gameObjects);

        this.gameObjects.forEach((obj) => obj.update());
        // Request an animation frame for the first time
        // The gameLoop() function will be called as a callback of this request
        //
        document.addEventListener("keydown", (e) => {
            console.log("key down", e.key);
            const act = {
                ArrowRight: () => { this.gameObjects[0].vx = 10; },
                ArrowLeft: () => { this.gameObjects[0].vx = -10; },
                space: () =>
                {
                    if (this.gameObjects[0].isBounded)
                    {
                        this.gameObjects[0].vy -= 10;
                        this.gameObjects[0].isBounded = false;
                    }
                }
            };

            switch (e.key)
            {
            case "ArrowRight":
                act[e.key]();
                break;
            case "ArrowLeft":
                act[e.key]();
                break;
            case " ":
                act["space"]();
                break;
            }


        });
        document.addEventListener("keyup", (e) => {
            console.log("key up", e.key);
            const act = {
                ArrowRight: () => { this.gameObjects[0].vx -= 10; },
                ArrowLeft: () => { this.gameObjects[0].vx += 10; },
            };

            switch (e.key)
            {
            case "ArrowRight":
                act[e.key]();
                break;
            case "ArrowLeft":
                act[e.key]();
                break;
            }

        });

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
