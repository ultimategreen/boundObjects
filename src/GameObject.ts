export abstract class GameObject 
{
    context: CanvasRenderingContext2D;
    x: number;
    y: number;
    vx: number;
    vy: number;
    mass: number;
    fixed: boolean;
    width: number;
    height: number;
    restitution: number;
    isColliding: boolean;
    isBounded: boolean;

    constructor(context: CanvasRenderingContext2D, x:number , y:number , vx:number , vy:number , mass:number, fixed:boolean, restitution: number, width: number, height: number )
    {
        this.context = context;
        this.x = x;
        this.y = y;
        this.mass = mass;
        this.width = width;
        this.height = height;
        this.restitution = restitution;
        this.fixed = fixed;
        this.isColliding = false;
        this.isBounded = false;

        if (fixed === true) 
        {
            this.vy = 0;
            this.vx = 0;
        }
        else
        {
            this.vx = vx;
            this.vy = vy;
        }
    }

    abstract update(): void;
    abstract draw(): void;
}
