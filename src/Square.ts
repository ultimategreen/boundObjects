import { GameObject } from "./GameObject";

export class Square extends GameObject 
{
    constructor(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, mass: number, fixed: boolean, vx = 0,  vy = 100, restitution = 0.9) 
    {
        super(context, x, y, vx, vy, mass, fixed, restitution, width, height);
    }

    draw() 
    {
    //Draw a simple square
        this.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";
        this.context.fillRect(this.x, this.y, this.width, this.height);
    }

    update()
    {
        if (this.fixed === false) 
        {
            const g = 0.0981;
            // Apply acceleration
            this.vy += g;
            //Move with set velocity
            this.y += this.vy;
        }
        else
        {
            this.vy = 0;
        }
    }
}

export class Circle extends GameObject 
{
    r: number;

    constructor(context: CanvasRenderingContext2D, x: number, y: number, r: number, mass: number, fixed: boolean, vx: number, vy = 100) 
    {
        super(context, x, y, vx, vy, mass, fixed, 1.0, r, r);

        this.r = r;
    }

    draw()
    {
        this.context.fillStyle = this.isColliding ? "#ff8080" : "#0099b0";
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.context.fill();

        this.context.beginPath();
        this.context.strokeStyle = "green";
        this.context.moveTo(this.x, this.y);
        this.context.lineTo(this.x + this.vx * 100, this.y + this.vy * 100);
        this.context.stroke();
    }

    update()
    {
        if (this.fixed === false) 
        {
            const g = 0.0981;
            // Apply acceleration
            this.vy += g * 4;
            if (this.vy > 10)
            {
                this.vy = 10;
            }

            // Move with set velocity
            this.x += this.vx;
            this.y += this.vy;
        }
        else 
        {
            this.vy = 0;
            this.vy = 0;
        }
    }
}
