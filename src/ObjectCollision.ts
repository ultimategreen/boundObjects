import { Square, Circle } from "./Square";
import { CollisionObjects } from "./CollisionEngine";

function square(value: number)
{
    return value * value;
}

export function rectIntersect(obj1: Square, obj2: Square, data:CollisionObjects)
{
    data.distance = Math.sqrt(
        square(obj1.x - obj2.x) + square(obj1.y - obj2.y)
    );
    data.vCollision = {
        x: (obj1.x + obj1.width / 2) - (obj2.x + obj2.width / 2),
        y: (obj1.y + obj1.height / 2) - (obj2.y + obj2.height / 2),
    };

    // Check x and y for overlap
    if (
        obj2.x > obj1.width + obj1.x ||
        obj1.x > obj2.width + obj2.x ||
        obj2.y > obj1.height + obj1.y ||
        obj1.y > obj2.height + obj2.y
    )
    {
        return false;
    }
    else
    {
        if (
            obj2.fixed == false && obj2.y < obj1.y && obj1.y < obj2.y + obj2.height
        )
        {
            obj2.y = obj1.y - obj2.height;
        }
        if (
            obj1.fixed == false && obj1.y < obj2.y && obj2.y < obj1.y + obj1.height
        )
        {
            obj1.y = obj2.y - obj1.height;
        }
        return true;
    }
}

export function circleIntersect(obj1: Circle, obj2: Circle, data:CollisionObjects)
{

    // Calculate the distance between the two circles
    data.distance =
        square(obj1.x - obj2.x) + square(obj1.y - obj2.y);
    data.vCollision = {
        x: obj1.x - obj2.x,
        y: obj1.y - obj2.y,
    };

    // When the distance is smaller or equal to the sum
    // of the two radiu* (obj1.y - obj2.y)s, the circles touch or overlap
    if (data.distance < square(obj1.r + obj2.r))
    {
        if (obj1.fixed === false)
        {
            obj1.y = obj2.y + (obj1.y - obj2.y) *
                        ((obj1.r + obj2.r) / Math.sqrt(data.distance));
        }
        if (obj2.fixed === false)
        {
            obj2.y = obj1.y + (obj2.y - obj1.y) *
                            ((obj2.r + obj1.r) / Math.sqrt(data.distance));
        }
        return true;
    }
    return false;
}

export function intersects(circle: Circle, squre: Square, data:CollisionObjects)
{
    data.vCollision = {
        x: Math.abs(circle.x - (squre.x + squre.width / 2)),
        y: Math.abs(circle.y - (squre.y + squre.height / 2)),
    };
    data.vCollisionSlope = data.vCollision.y / data.vCollision.x;
    data.distance = Math.sqrt(
        square(data.vCollision.x - squre.width / 2) +
            square(data.vCollision.y - squre.height / 2)
    );
    data.slopeThreshold = {
        horizontal : (squre.height + circle.r) / squre.width,
        vertical : squre.height / (circle.r + squre.width)
    };

    if (data.vCollision.x > squre.width / 2 + circle.r)
    {
        return false;
    }
    if (data.vCollision.y > squre.height / 2 + circle.r)
    {
        return false;
    }

    // vertex
    if (data.slopeThreshold.horizontal > data.vCollisionSlope && data.vCollisionSlope > data.slopeThreshold.vertical)
    {
        if (data.distance < circle.r)
        {
            data.dir = "vertex";
            console.log(data.dir);
            return true;
        }
        return false;
    }

    //horizontal side
    if (data.slopeThreshold.horizontal >= data.vCollisionSlope && data.vCollision.x < squre.width + circle.r)
    {
        if (squre.fixed === false && squre.x < circle.x && circle.x < squre.x + squre.width)
        {
            squre.x = circle.x - circle.r - squre.width;
        }
        if (circle.fixed === false)
        {
            const rightSide = squre.x + squre.width;
            const leftSide = squre.x;
            if (circle.x - circle.r <= rightSide && rightSide < circle.x )
            // right side
            {
                circle.x = squre.x + squre.width + circle.r;
            }

            else if (circle.x <= leftSide && leftSide < circle.x + circle.r)
            // left side
            {
                circle.x = squre.x - circle.r;
            }
        }
        data.dir = "horizontal";
        console.log(data.dir);
        return true;
    }

    // vertical side
    if (data.vCollisionSlope >= data.slopeThreshold.vertical && data.vCollision.y < squre.height + circle.r)
    {
        if (squre.fixed === false && squre.y < circle.y && circle.y < squre.y + squre.height)
        {
            squre.y = circle.y - circle.r - squre.height;
        }
        if (circle.fixed === false && circle.y < squre.y && squre.y < circle.y + circle.r)
        {
            circle.y = squre.y - circle.r;
        }
        data.dir = "vertical";
        console.log(data.dir);
        return true;
    }

    return false;
}
