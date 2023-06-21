import { GameObject } from "./GameObject";
import { Square, Circle } from "./Square";
import { rectIntersect, circleIntersect, intersects } from "./ObjectCollision";

export class CollisionObjects
{
    obj1: GameObject;
    obj2: GameObject;

    vCollision: {
        x: number,
        y: number
    };
    vCollisionSlope: number;
    distance: number;
    slopeThreshold : {
        horizontal : number,
        vertical : number
    };
    dir : "vertical" | "horizontal" | "vertex" | undefined;

    constructor(obj1: GameObject, obj2: GameObject)
    {
        this.obj1 = obj1;
        this.obj2 = obj2;
        this.vCollision = {
            x: 0,
            y: 0
        };
        this.distance = 0;
        this.slopeThreshold = {
            horizontal: 0,
            vertical: 0
        };
        this.vCollisionSlope = 0;
        this.dir = undefined;
    }

    handleCollision()
    {
        if (this.obj1 instanceof Square && this.obj2 instanceof Square)
        {
            return rectIntersect(this.obj1, this.obj2, this);
        }

        if (this.obj1 instanceof Circle && this.obj2 instanceof Circle)
        {
            return circleIntersect(this.obj1, this.obj2, this);
        }

        if (this.obj1 instanceof Circle && this.obj2 instanceof Square) 
        {
            return intersects(this.obj1, this.obj2, this);
        }
        if (this.obj1 instanceof Square && this.obj2 instanceof Circle)
        {
            return intersects(this.obj2, this.obj1, this);
        }
        return false;
    }
}

export class CollisionEngine 
{
    gameObjects: GameObject[];

    constructor(gameObjects: GameObject[])
    {
        this.gameObjects = gameObjects;
    }

    detectCollisionAtEdge()
    {
        const canvasWidth = 1000;
        const canvasHeight = 1000;

        const restitution = 1.0;
        for (const obj of this.gameObjects) 
        {
            obj.isColliding = false;

            // Check for left and right
            if (obj.x < 0)
            {
                obj.vx = Math.abs(obj.vx) * restitution;
                obj.x = 0;
            }
            else if (obj.x > canvasWidth - obj.width)
            {
                obj.vx = -Math.abs(obj.vx) * restitution;
                obj.x = canvasWidth - obj.width;
            }

            // Check for bottom and top
            if (obj.y < 0)
            {
                obj.vy = Math.abs(obj.vy) * restitution;
                obj.y = 0;
            }
            else if (obj.y > canvasHeight - obj.height)
            {
                obj.vy = -Math.abs(obj.vy) * restitution;
                obj.y = canvasHeight - obj.height;
                obj.isBounded = true;
            }
        }

        this.checkCollision();
    }

    checkCollision()
    {
        for (const [i, obj1] of this.gameObjects.entries()) 
        {
            for (const obj2 of this.gameObjects.slice(i + 1)) 
            {
                const data = new CollisionObjects(obj1, obj2);

                if (data.handleCollision() &&  this.calculateCollisions(data))
                {
                    break;
                }
            }
        }
    }

    calculateCollisions(data: CollisionObjects)
    {
        data.obj1.isColliding = true;
        data.obj2.isColliding = true;
        data.obj1.isBounded = true;
        data.obj2.isBounded = true;

        const vCollisionNorm = data.vCollision.y / data.distance;
        const vRelativeVelocity = data.obj1.vy - data.obj2.vy;
        const speed = vRelativeVelocity * vCollisionNorm;

        if (data.dir === "horizontal")
        {
            if (data.obj1.vx * data.obj2.vx <= 0)
            {
                data.obj2.vx = -1 * data.obj2.vx * data.obj2.restitution;
                data.obj1.vx = -1 * data.obj1.vx * data.obj1.restitution;
            }
            else if (data.obj1.vx * data.obj2.vx > 0)
            {
                const tempVx = data.obj2.vx;
                data.obj2.vx = data.obj1.vx;
                data.obj1.vx = tempVx;
            }
        }

        if (data.dir === "vertical")
        {
            if (data.obj1.vy * data.obj2.vy <= 0)
            {
                data.obj2.vy = -1 * data.obj2.vy * data.obj2.restitution;
                data.obj1.vy = -1 * data.obj1.vy * data.obj1.restitution;
            }
            else if (data.obj1.vy * data.obj2.vy > 0)
            {
                const tempVy = data.obj2.vy;
                data.obj2.vy = data.obj1.vy;
                data.obj1.vy = tempVy;
            }
        }

        if (data.dir === "vertex")
        {
            data.obj2.vx *= -1;
            data.obj1.vx *= -1;
            data.obj2.vy *= -1;
            data.obj1.vy *= -1;
        }
        // console.log("speed", speed);
        if (speed < 0)
        {
            return true;
        }

        // const impulse = (2 * speed) / (data.obj1.mass + data.obj2.mass);
        // data.obj1.vy -= impulse * data.obj2.mass * vCollisionNorm;
        // data.obj2.vy += impulse * data.obj1.mass * vCollisionNorm;
        //
    }
}
